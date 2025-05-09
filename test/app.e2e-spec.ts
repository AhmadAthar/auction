import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  jest.setTimeout(100000);
  beforeEach(async () => {
    jest.setTimeout(100000); 
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/bid/createBid (POST) - should process bid', async () => {

    const createItemDto = {
      name: "item-1",
      startingPrice: 1000,
      duration: 3600,
      description: "item-1 description",
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
      .expect(201);  

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id');
    console.log(response.body);
  }, 100000);  


  it('/bid/createBid (POST) - should handle race condition between bids', async () => {
    const createItemDto = {
      name: "race-item",
      startingPrice: 1000,
      duration: 3600,
      description: "some description"
    };
  
    const itemCreated = await request(app.getHttpServer())
      .post('/item/createItem')
      .send(createItemDto)
      .expect(201);
  
    const itemId = itemCreated.body.id;
  
    const user1 = await request(app.getHttpServer())
      .post('/user/createUser')
      .send({ firstName: 'User', lastName: 'One' })
      .expect(201);
  
    const user2 = await request(app.getHttpServer())
      .post('/user/createUser')
      .send({ firstName: 'User', lastName: 'Two' })
      .expect(201);
  
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
  
    
    
  }, 15000);
  
});
