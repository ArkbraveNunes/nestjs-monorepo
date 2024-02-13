import { FormatSimpleQueryInputDto } from './mongo.helper.dto';

export class MongoHelper {
  static formatSimpleQuery({
    baseKey,
    iterationObject,
  }: FormatSimpleQueryInputDto): Record<string, any> {
    const queryResult = {};

    Object.keys(iterationObject).forEach((property) => {
      const queryKey = `${baseKey}.${property}`;
      queryResult[queryKey] = iterationObject[property];
    });

    return queryResult;
  }
}
