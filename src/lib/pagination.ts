export interface IPaginationResult {
  length: number;
  next: {
    page: number;
    limit: number;
  };
  previous: {
    page: number;
    limit: number;
  };
  data: null | any[];
}
export interface IPaginationReturnVal {
  result: IPaginationResult;
  limit: number;
  startIndex: number;
}

export const getPaginationProperty = async (
  page: number,
  limit: number,
  model: any,
  filter: any
): Promise<IPaginationReturnVal> => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  let result: IPaginationResult = {
    length: 0,
    next: {
      limit: 0,
      page: 0,
    },
    previous: {
      limit: 0,
      page: 0,
    },
    data: [],
  };

  const totalDocuments = await model.countDocuments(filter).exec();
  result.length = totalDocuments;
  if (endIndex < totalDocuments) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  

  return { result, limit: limit, startIndex };
};

module.exports = {
  getPaginationProperty,
};
