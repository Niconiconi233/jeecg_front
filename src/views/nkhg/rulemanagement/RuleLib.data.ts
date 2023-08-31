import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '制度标题',
    align: "center",
    dataIndex: 'title'
  },
  {
    title: '文号',
    align: "center",
    dataIndex: 'docNo'
  },
  {
    title: '印发时间',
    align: "center",
    dataIndex: 'dateOfIssuance',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text);
    },
  },
  {
    title: '是否现用',
    align: "center",
    dataIndex: 'inUse',
    customRender:({text}) => {
      if(text == null)
        return "NULL";
      else
        return text == 1 ? "是":"否";
    },
  },
  {
    title: '失效时间',
    align: "center",
    dataIndex: 'failureTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text);
    },
  },
  {
    title: '文件地址',
    align: "center",
    dataIndex: 'fileName',
    slots: { customRender: 'fileSlot' },
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "制度标题",
    field: 'title',
    component: 'Input',
    colProps: {span: 6},
  },
  {
    label: "文号",
    field: 'docNo',
    component: 'Input',
    colProps: {span: 6},
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '制度标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '文号',
    field: 'docNo',
    component: 'Input',
  },
  {
    label: '印发时间',
    field: 'dateOfIssuance',
    component: 'DatePicker',
  },
  {
    label: '是否现用',
    field: 'inUse',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode: ""
    },
  },
  {
    label: '失效时间',
    field: 'failureTime',
    component: 'DatePicker',
  },
  {
    label: '文件地址',
    field: 'fileUrl',
    component: 'JUpload',
    componentProps:{
     },
  },
	// TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
