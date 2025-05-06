import {Test, type TestingModule} from '@nestjs/testing';
import {type INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {GreendocsExtractorModule} from './../src/greendocs-extractor.module';

describe('GreendocsExtractorController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GreendocsExtractorModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
