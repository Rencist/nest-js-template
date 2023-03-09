import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyService', () => {
  it('should be defined', () => {
    expect(new ApiKeyGuard()).toBeDefined();
  });
});
