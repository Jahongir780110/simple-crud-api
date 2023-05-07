import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../interfaces/User';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const users: User[] = [];

export function getUsers(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      success: true,
      message: users,
    }),
  );
}

export function getUser(req: IncomingMessage, res: ServerResponse) {
  const userId = req.url?.split('/api/users/')[1];

  const isValidUUID = uuidValidate(userId as string);

  if (!isValidUUID) {
    res.writeHead(400, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: false,
        message: 'Not valid user id',
      }),
    );
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: false,
        message: 'User not found',
      }),
    );
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(
    JSON.stringify({
      success: true,
      message: user,
    }),
  );
}

export function addUser(req: IncomingMessage, res: ServerResponse) {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk.toString();
  });

  req.on('end', () => {
    const parsedData = JSON.parse(data);

    if (
      parsedData.hasOwnProperty('username') &&
      parsedData.hasOwnProperty('age') &&
      parsedData.hasOwnProperty('hobbies')
    ) {
      const newUser: User = {
        id: uuidv4(),
        username: parsedData.username,
        age: parsedData.age,
        hobbies: parsedData.hobbies,
      };

      users.push(newUser);

      res.writeHead(201, {
        'Content-Type': 'application/json',
      });
      return res.end(
        JSON.stringify({
          success: true,
          message: newUser,
        }),
      );
    }

    res.writeHead(400, {
      'Content-Type': 'application/json',
    });
    res.end(
      JSON.stringify({
        success: false,
        message: 'Not valid body parameters',
      }),
    );
  });
}

export function updateUser(req: IncomingMessage, res: ServerResponse) {
  const userId = req.url?.split('/api/users/')[1];

  const isValidUUID = uuidValidate(userId as string);

  if (!isValidUUID) {
    res.writeHead(400, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: false,
        message: 'Not valid user id',
      }),
    );
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: false,
        message: 'User not found',
      }),
    );
  }

  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const parsedData = JSON.parse(data);
    user.username = parsedData.username;
    user.age = parsedData.age;
    user.hobbies = parsedData.hobbies;

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: true,
        message: user,
      }),
    );
  });
}

export function deleteuser(req: IncomingMessage, res: ServerResponse) {
  const userId = req.url?.split('/api/users/')[1];

  const isValidUUID = uuidValidate(userId as string);

  if (!isValidUUID) {
    res.writeHead(400, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: false,
        message: 'Not valid user id',
      }),
    );
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        success: false,
        message: 'User not found',
      }),
    );
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  users.splice(userIndex, 1);

  res.writeHead(204, {
    'Content-Type': 'application/json',
  });
  res.end();
}
