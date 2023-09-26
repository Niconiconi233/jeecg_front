<template>
  <a-spin :spinning="confirmLoading">
    <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-row>
        <a-col :span="24">
          <a-form-item label="制度标题" v-bind="validateInfos.title">
            <a-input v-model:value="formData.title" placeholder="请输入制度标题" :disabled="disabled"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="文号" v-bind="validateInfos.docNo">
            <a-input v-model:value="formData.docNo" placeholder="请输入文号" :disabled="disabled"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="印发时间" v-bind="validateInfos.dateOfIssuance">
		        <a-date-picker placeholder="请选择印发时间" v-model:value="formData.dateOfIssuance" value-format="YYYY-MM-DD"  style="width: 100%" :disabled="disabled"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="是否现用" v-bind="validateInfos.inUse">
            <j-dict-select-tag type='radio' v-model:value="formData.inUse" dictCode="yn" placeholder="请选择是否现用" :disabled="disabled" @change="handleRadioChange" stringToNumber=true />
          </a-form-item>
        </a-col>
        <a-col :span="24" v-if="!inuse">
          <a-form-item label="失效时间" v-bind="validateInfos.failureTime">
		        <a-date-picker placeholder="请选择失效时间" v-model:value="formData.failureTime" value-format="YYYY-MM-DD"  style="width: 100%" :disabled="disabled"/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="制度标签" v-bind="validateInfos.tags">
            <JSelectMultiple placeholder="请选择制度标签" v-model:value="formData.tags" dictCode="tags" :disabled="disabled"></JSelectMultiple>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="文件地址" v-bind="validateInfos.fileUrl">
	          <j-upload v-model:value="formData.fileUrl" :disabled="disabled" :biz-path="logUserDept.departName"></j-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  defineExpose,
  nextTick,
  defineProps,
  computed,
  onBeforeMount
} from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import JUpload from '/@/components/Form/src/jeecg/components/JUpload/JUpload.vue';
  import { getValueType } from '/@/utils';
  import {getFileUrl, saveOrUpdate} from '../RuleLib.api';
  import { Form } from 'ant-design-vue';
  import {getLoginBackInfo} from "/@/utils/auth";
  import JSelectMultiple from "@/components/Form/src/jeecg/components/JSelectMultiple.vue";

  let logUserDept = ref(null)

  let inuse = ref(1);

  let tags = ref([]);

  onBeforeMount(()=>{
    logUserDept.value = getLoginBackInfo().departs[0];
  });

  const handleRadioChange = (value) => {
    if(value == 1)
      inuse.value = 1;
    else
      inuse.value = 0;
  }
  
  const props = defineProps({
    formDisabled: { type: Boolean, default: false },
    formData: { type: Object, default: ()=>{} },
    formBpm: { type: Boolean, default: true }
  });
  const formRef = ref();
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    title: '',   
    docNo: '',   
    dateOfIssuance: '',   
    inUse: 1,
    failureTime: '',
    fileUrl: '',
    fileName: '',
    tags: '',
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = {
  };
  const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: true });

  // 表单禁用
  const disabled = computed(()=>{
    if(props.formBpm === true){
      if(props.formData.disabled === false){
        return false;
      }else{
        return true;
      }
    }
    return props.formDisabled;
  });
  
  /**
   * 新增
   */
  function add() {
    edit({});
  }

  /**
   * 编辑
   */
  function edit(record) {
    nextTick(() => {
      resetFields();
      //赋值
      Object.assign(formData, record);
      console.log(formData)
    });
  }

  /**
   * 提交数据
   */
  async function submitForm() {
    // 触发表单验证
    await validate();
    confirmLoading.value = true;
    const isUpdate = ref<boolean>(false);
    //时间格式化
    let model = formData;
    if (model.id) {
      isUpdate.value = true;
    }
    //循环数据
    for (let data in model) {
      //如果该数据是数组并且是字符串类型
      if (model[data] instanceof Array) {
        let valueType = getValueType(formRef.value.getProps, data);
        //如果是字符串类型的需要变成以逗号分割的字符串
        if (valueType === 'string') {
          model[data] = model[data].join(',');
        }
      }
    }
    await saveOrUpdate(model, isUpdate.value)
      .then((res) => {
        if (res.success) {
          createMessage.success(res.message);
          emit('ok');
        } else {
          createMessage.warning(res.message);
        }
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  }

  defineExpose({
    add,
    edit,
    submitForm,
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    min-height: 500px !important;
    overflow-y: auto;
    padding: 24px 24px 24px 24px;
  }
</style>
