
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'apexstore_dev_secret';

// ---------- Home Route ----------

app.get('/', (req, res) => {
    res.send('Welcome to ApexStore API Server!');
});

// ---------- Product Image Helper ----------

const img = (photoId) =>
    `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=85`;

// ---------- Product Data ----------

const products = [
    {
        id: 1,
        name: 'Apex Wireless Headphones',
        price: 2499,
        category: 'Electronics',
        image: img('photo-1505740420928-5e560c06d30e'),
        description: 'Over-ear Bluetooth headphones with deep bass and 30 hour battery life.'
    },
    {
        id: 2,
        name: 'Apex Smart Watch',
        price: 3999,
        category: 'Electronics',
        image: img('photo-1523275335684-37898b6baf30'),
        description: 'Track steps, heart rate and notifications right from your wrist.'
    },
    {
        id: 3,
        name: 'Portable Power Bank 10000mAh',
        price: 1199,
        category: 'Electronics',
        image: img('photo-1609091839311-d5365f9ff1c5'),
        description: 'Slim fast-charging power bank.'
    },
    {
        id: 4,
        name: 'Classic Cotton T-Shirt',
        price: 599,
        category: 'Fashion',
        image: img('photo-1521572163474-6864f9cf17ab'),
        description: 'Soft and breathable everyday t-shirt.'
    },
    {
        id: 5,
        name: 'Slim Fit Denim Jeans',
        price: 1499,
        category: 'Fashion',
        image: img('photo-1542272604-787c3835535d'),
        description: 'Comfortable stretch denim jeans.'
    },
    {
        id: 6,
        name: 'Running Sneakers',
        price: 2199,
        category: 'Fashion',
        image: img('photo-1542291026-7eec264c27ff'),
        description: 'Lightweight sneakers with cushioned sole.'
    },
    {
        id: 7,
        name: 'Ceramic Coffee Mug Set',
        price: 799,
        category: 'Home',
        image: img('photo-1514228742587-6b1558fcca3d'),
        description: 'Set of 4 ceramic coffee mugs.'
    },
    {
        id: 8,
        name: 'LED Desk Lamp',
        price: 999,
        category: 'Home',
        image: img('photo-1507473885765-e6ed057f782c'),
        description: 'Adjustable desk lamp with brightness modes.'
    },
    {
        id: 9,
        name: 'Everyday Backpack',
        price: 1799,
        category: 'Accessories',
        image: img('photo-1553062407-98eeb64c6a62'),
        description: 'Water-resistant backpack with laptop compartment.'
    },
    {
        id: 10,
        name: 'Polarized Sunglasses',
        price: 899,
        category: 'Accessories',
        image: img('photo-1511499767150-a48a237f0083'),
        description: 'UV400 polarized sunglasses.'
    }
];

// ---------- Temporary Storage ----------

const users = [];
const orders = [];

// ---------- Generate JWT Token ----------

const makeToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// ---------- Authentication Middleware ----------

const auth = (req, res, next) => {
    const header = req.headers.authorization || '';

    const token = header.startsWith('Bearer ')
        ? header.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            message: 'Please log in first'
        });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Session expired, please log in again'
        });
    }
};

// ---------- Get All Products ----------

app.get('/api/products', (req, res) => {
    const { search = '', category = '' } = req.query;

    const q = search.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q);

        const matchesCategory =
            !category || product.category === category;

        return matchesSearch && matchesCategory;
    });

    res.json(filteredProducts);
});

// ---------- Get Single Product ----------

app.get('/api/products/:id', (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    res.json(product);
});

// ---------- User Registration ----------

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                message: 'Enter a valid email'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (users.find(u => u.email === normalizedEmail)) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        const user = {
            id: users.length + 1,
            name: name.trim(),
            email: normalizedEmail,
            passwordHash: await bcrypt.hash(password, 10)
        };

        users.push(user);

        res.status(201).json({
            token: makeToken(user),
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Registration failed'
        });
    }
});

// ---------- User Login ----------

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = users.find(
            u => u.email === normalizedEmail
        );

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        res.json({
            token: makeToken(user),
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Login failed'
        });
    }
});

// ---------- Place Order ----------

app.post('/api/orders', auth, (req, res) => {
    const { items, address } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            message: 'Cart is empty'
        });
    }

    if (
        !address ||
        !address.fullName ||
        !address.phone ||
        !address.street ||
        !address.city ||
        !address.pincode
    ) {
        return res.status(400).json({
            message: 'Please fill all delivery details'
        });
    }

    const orderItems = [];

    for (const item of items) {
        const product = products.find(
            p => p.id === Number(item.productId)
        );

        const qty = Number(item.quantity);

        if (!product || !Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                message: 'Invalid item in cart'
            });
        }

        orderItems.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: qty
        });
    }

    const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order = {
        id: 'APX' + String(orders.length + 1001),
        userId: req.user.id,
        items: orderItems,
        total,
        address,
        status: 'Placed',
        createdAt: new Date().toISOString()
    };

    orders.push(order);

    res.status(201).json(order);
});

// ---------- Get User Orders ----------

app.get('/api/orders', auth, (req, res) => {
    const userOrders = orders
        .filter(order => order.userId === req.user.id)
        .reverse();

    res.json(userOrders);
});

// ---------- 404 Route ----------

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// ---------- Start Server ----------

app.listen(PORT, () => {
    console.log(`ApexStore server running on http://localhost:${PORT}`);
});
