

const parsePath = (originPath: string) => {
  const devided = originPath.split('/').filter(s => !!s);

  let pathArr: string[] = [];
  let params: Record<string, {
    isRequired: boolean
  }> = {};

  devided.forEach(str => {
    if(!str.includes(':')) {
      pathArr = [...pathArr, str];
    } else {
      const purePath = str.replace(/:|\?/g, '');
      params = {
        ...params,
        [purePath]: {
          isRequired: !str.includes('?')
        }
      };
    }
  });

  const path = pathArr.join('/');

  return ({
    path,
    params,
  });
};

export default parsePath;