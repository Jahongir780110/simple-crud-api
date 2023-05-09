import http from 'http';
import { RequestOptions } from 'http';
import 'dotenv/config';

import './index.js';

function httpRequest(options: RequestOptions, body?: any) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function logError(error: Error) {
  console.log(`Error: ${error.message}`);
}

// Tests

async function getUsers() {
  try {
    const options: RequestOptions = {
      hostname: 'localhost',
      path: '/api/users',
      method: 'GET',
      port: process.env.PORT,
    };

    const getUsersResult = JSON.parse((await httpRequest(options)) as any);

    if (getUsersResult.success === true && !getUsersResult.message.length) {
      console.log('Test 1 passed: should get empty users array successfully');
    } else {
      logError(new Error('Test 1 failed: should get empty users array successfully'));
    }
  } catch (e: any) {
    logError(e);
  }
}

async function postUser() {
  try {
    const options: RequestOptions = {
      hostname: 'localhost',
      path: '/api/users',
      method: 'POST',
      port: process.env.PORT,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = { username: 'Test', age: 23, hobbies: ['Football'] };

    const postUserResult = JSON.parse((await httpRequest(options, JSON.stringify(body))) as any);

    if (postUserResult.success === true && postUserResult.message.username && postUserResult.message.id) {
      console.log('Test 2 passed: should post user successfully');
      return postUserResult.message.id;
    } else {
      logError(new Error('Test 2 failed: should post user successfully'));
    }
  } catch (e: any) {
    logError(e);
  }
}

async function getUser(id: string) {
  try {
    const options: RequestOptions = {
      hostname: 'localhost',
      path: `/api/users/${id}`,
      method: 'GET',
      port: process.env.PORT,
    };

    const getUserResult = JSON.parse((await httpRequest(options)) as any);

    if (getUserResult.success === true && getUserResult.message.username) {
      console.log('Test 3 passed: should get user successfully');
    } else {
      logError(new Error('Test 3 failed: should get user successfully'));
    }
  } catch (e: any) {
    logError(e);
  }
}

async function putUser(id: string) {
  try {
    const options: RequestOptions = {
      hostname: 'localhost',
      path: `/api/users/${id}`,
      method: 'PUT',
      port: process.env.PORT,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = { username: 'Test', age: 23, hobbies: ['Football'] };

    const putUserResult = JSON.parse((await httpRequest(options, JSON.stringify(body))) as any);

    if (putUserResult.success === true && putUserResult.message.username === 'Test') {
      console.log('Test 4 passed: should update user successfully');
    } else {
      logError(new Error('Test 4 failed: should update usersuccessfully'));
    }
  } catch (e: any) {
    logError(e);
  }
}

async function deleteUser(id: string) {
  try {
    const options: RequestOptions = {
      hostname: 'localhost',
      path: `/api/users/${id}`,
      method: 'DELETE',
      port: process.env.PORT,
    };

    const deleteUserResult = (await httpRequest(options)) as any;

    if (!deleteUserResult.length) {
      console.log('Test 5 passed: should delete user successfully');
    } else {
      logError(new Error('Test 5 failed: should delete user successfully'));
    }
  } catch (e: any) {
    logError(e);
  }
}

async function getNonExistingUser(id: string) {
  try {
    const options: RequestOptions = {
      hostname: 'localhost',
      path: `/api/users/${id}`,
      method: 'GET',
      port: process.env.PORT,
    };

    const getUserResult = JSON.parse((await httpRequest(options)) as any);

    if (getUserResult.success === false) {
      console.log("Test 6 passed: shouldn't get non-existing user");
    } else {
      logError(new Error("Test 3 failed: shouldn't get non-existing user"));
    }
  } catch (e: any) {
    logError(e);
  }
}

async function performAllTests() {
  await getUsers();
  const userId = await postUser();
  await getUser(userId);
  await putUser(userId);
  await deleteUser(userId);
  getNonExistingUser(userId);
}
performAllTests();
