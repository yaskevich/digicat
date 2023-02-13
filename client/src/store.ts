import { reactive, ref } from 'vue';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import project from '../package.json';
import catalog from '../../server/data/catalog.json';
const db = catalog as keyable;

export default {
    version: project?.version,
    git: 'https' + project?.repository?.url?.slice(3, -4),
    db,
  };

