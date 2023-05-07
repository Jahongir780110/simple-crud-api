import http from 'http';
import 'dotenv/config';
import { addUser, deleteuser, getUser, getUsers, updateUser } from './controllers/user.js';

const server = http.createServer((req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/users') {
      return getUsers(req, res);
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/users/')) {
      return getUser(req, res);
    }

    if (req.method === 'POST' && req.url === '/api/users') {
      return addUser(req, res);
    }

    if (req.method === 'PUT' && req.url?.startsWith('/api/users/')) {
      return updateUser(req, res);
    }

    if (req.method === 'DELETE' && req.url?.startsWith('/api/users/')) {
      return deleteuser(req, res);
    }

    res.writeHead(404, {
      'Content-Type': 'application/json',
    });
    res.end(
      JSON.stringify({
        success: false,
        message: 'Endpoint not found',
      }),
    );
  } catch (err) {
    res.writeHead(500, {
      'Contenty-Type': 'application/json',
    });
    res.end(
      JSON.stringify({
        success: false,
        message: 'Ooops! Server error!',
      }),
    );
  }
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
