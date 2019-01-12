const isEmpty = value => {   //判断传入的value是否为空
  return value === undefined || value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
}

module.exports = isEmpty;
