import { Tspec } from 'tspec';

import { API_VERSION } from './common.conf';

const tspecConfig: Tspec.GenerateParams = {
  specPathGlobs: [`src/${API_VERSION}/specs/*.ts`],
  openapi: {
    title: 'Comic API',
    description:
      'API for comic application. Please visit the api documentation on Github for more information.',
    version: '1.0.0',
  },
};

export default tspecConfig;
