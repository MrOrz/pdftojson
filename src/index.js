import promisify from 'es6-promisify';

export default async function pdftojson(pdfFileName, options){
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
  return {data: 'Yo!'};
}