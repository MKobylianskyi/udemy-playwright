import { test, expect } from '@playwright/test'

test.describe.parallel('API testing', () => {
  const baseURL = 'https://reqres.in/api'

  test('Simple API test  - Asssert REspounce', async ({ request }) => {
    const responce = await request.get(`${baseURL}/users/2`)
    expect(responce.status()).toBe(200)

    const responceBody = JSON.parse(await responce.text())
    // console.log(responceBody)
  })

  test('Simple API test  - Asssert Unexisted endpoint', async ({ request }) => {
    const responce = await request.get(`${baseURL}/users/asdasd`)
    expect(responce.status()).toBe(404)
  })

  test('API - Get user Details', async ({ request }) => {
    const responce = await request.get(`${baseURL}/users/1`)
    const responceBody = JSON.parse(await responce.text())
    expect(responce.status()).toBe(200)
    expect(responceBody.data.id).toBe(1)
    expect(responceBody.data.first_name).toBe('George')
    expect(responceBody.data.last_name).toBe('Bluth')
    expect(responceBody.data.email).toBeTruthy()
    // console.log(responceBody)
  })

  test('Post reuqest', async ({ request }) => {
    const responce = await request.post(`${baseURL}/user`, {
      data: {
        id: 127,
      },
    })
    const responceBody = JSON.parse(await responce.text())
    // console.log(responceBody)
    expect(responceBody.createdAt).toBeTruthy()
  })

  test('API- Post Login Success', async ({ request }) => {
    const responce = await request.post(`${baseURL}/login`, {
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    })
    const responceBody = JSON.parse(await responce.text())
    expect(responce.status()).toBe(200)
    expect(responceBody.token).toBe('QpwL5tke4Pnpja7X4')
  })

  test('API- Post Login Error', async ({ request }) => {
    const responce = await request.post(`${baseURL}/login`, {
      data: {
        email: 'peter@klaven',
      },
    })
    const responceBody = JSON.parse(await responce.text())
    expect(responce.status()).toBe(400)
    expect(responceBody.error).toBe('Missing password')
  })

  test('API- PUT user', async ({ request }) => {
    const responce = await request.put(`${baseURL}/users/2`, {
      data: {
        name: 'misha',
        job: 'qa',
      },
    })
    const responceBody = JSON.parse(await responce.text())
    expect(responce.status()).toBe(200)
    expect(responceBody.name).toBe('misha')
    expect(responceBody.job).toBe('qa')
    // console.log(responceBody)
    expect(responceBody.updatedAt).toBeTruthy()
  })

  test('API - DELTe', async ({ request }) => {
    const responce = await request.delete(`${baseURL}/users/2`)
    expect(responce.status()).toBe(204)
  })
})
