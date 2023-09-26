import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/rulemanage/ruleLib/list',
}



export const getHotFileList = (params) => defHttp.get({url: Api.list, params})
