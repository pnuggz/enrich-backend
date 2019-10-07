export const authorize = (result, userId) => {
  return new Promise(res => {
    const unauthorizedData = []
    for(let i=0; i<result.length; i++) {
      const row = result[i]
      if(row.userId != userId) {
        unauthorizedData.push(row)
      }
    }
    (unauthorizedData > 0) ? res(false) : res(true)
  })
};

export const defaultUnauthMsg = () => {
  return {
    code: 403,
    error: `Unauthorized access.`,
    msg: ``
  };
}