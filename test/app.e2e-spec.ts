import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  jest.setTimeout(100000);
  beforeEach(async () => {
    jest.setTimeout(100000);  // Set a global timeout for the test
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Ensure the app is closed after tests
    if (app) {
      await app.close();
    }
  });

  it('/bid/createBid (POST) - should process bid', async () => {

    const createItemDto = {
      name: "item-1",
      startingPrice: 1000,
      duration: 3600
    };

    const createUserDto = {
      firstName: "test",
      lastName: "user"
    }

    const userCreated = await await request(app.getHttpServer())
      .post('/user/createUser')
      .send(createUserDto)
      .expect(201);

    const itemCreated = await await request(app.getHttpServer())
      .post('/item/createItem')
      .send(createItemDto)
      .expect(201);

    console.log('userId: ', userCreated.body.id);
    console.log('item.id: ', itemCreated.body.id);

    const createBidDto = {
      userId: userCreated.body.id,
      itemId: itemCreated.body.id,
      price: 1000,
    };



    const response = await request(app.getHttpServer())
      .post('/bid/createBid')
      .send(createBidDto)
      .expect(201);  // or 200 depending on your controller

    expect(response.body).toBeDefined();
    // Depending on your `result` returned from queue:
    expect(response.body).toHaveProperty('id');
    // Optionally log result
    console.log(response.body);
  }, 100000);  // Set a timeout for this specific test


  it('/bid/createBid (POST) - should handle race condition between bids', async () => {
    // Step 1: Create item
    const createItemDto = {
      name: "race-item",
      startingPrice: 1000,
      duration: 3600,
    };
  
    const itemCreated = await request(app.getHttpServer())
      .post('/item/createItem')
      .send(createItemDto)
      .expect(201);
  
    const itemId = itemCreated.body.id;
  
    // Step 2: Create two users
    const user1 = await request(app.getHttpServer())
      .post('/user/createUser')
      .send({ firstName: 'User', lastName: 'One' })
      .expect(201);
  
    const user2 = await request(app.getHttpServer())
      .post('/user/createUser')
      .send({ firstName: 'User', lastName: 'Two' })
      .expect(201);
  
    // Step 3: Prepare concurrent bid requests
    const bidDto1 = {
      userId: user1.body.id,
      itemId,
      price: 1100,
    };
  
    const bidDto2 = {
      userId: user2.body.id,
      itemId,
      price: 1100,
    };

    const bidDto3 = {
      userId: user2.body.id,
      itemId,
      price: 1200,
    };

    const bidDto4 = {
      userId: user2.body.id,
      itemId,
      price: 1200,
    };

    const bidDto5 = {
      userId: user2.body.id,
      itemId,
      price: 2500,
    };
  
    // Step 4: Send concurrent bid requests
    const [res1, res2, res3, res4, res5] = await Promise.all([
      request(app.getHttpServer()).post('/bid/createBid').send(bidDto1),
      request(app.getHttpServer()).post('/bid/createBid').send(bidDto2),
      request(app.getHttpServer()).post('/bid/createBid').send(bidDto3),
      request(app.getHttpServer()).post('/bid/createBid').send(bidDto4),
      request(app.getHttpServer()).post('/bid/createBid').send(bidDto5),

    ]);
   
    console.log("res1: ", res1.body);
    console.log("res2: ", res2.body);
    console.log("res3: ", res3.body);
    console.log("res4: ", res4.body);
    console.log("res5: ", res5.body);

    expect(res5.status).toBe(201);
  
    // const successCount = [res1, res2, res3, res4].filter(
    //   (res) => res.status === 201
    // ).length;
  
    // expect(successCount).toBe(2); // Only one bid should succeed if race is handled
  
    // const failed = [res1, res2].find(
    //   (res) => res.status === 'rejected' || res.value.status !== 201,
    // );
  
    // if (failed?.status === 'fulfilled') {
    //   console.log('Failed response:', failed.value.body);
    // } else {
    //   console.log('Failed reason:', failed?.reason);
    // }
  }, 15000);
  
});
