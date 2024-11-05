import { Tspec } from 'tspec';

import { API_VERSION } from '../constants/common.constant';

const tspecConfig: Tspec.GenerateParams = {
  specPathGlobs: [`src/${API_VERSION}/specs/*.ts`],
  openapi: {
    title: 'Comic API',
    description:
      'API for comic application. Please visit the api documentation on Github for more information.',
    version: `${API_VERSION}.0.0`,
  },
};

export default tspecConfig;
