<template>
  <PageWrapper :class="prefixCls" title="制度搜索">
    <template #headerContent>
      <BasicForm :class="`${prefixCls}__header-form`" :labelWidth="100" :schemas="schemas" :showActionButtonGroup="false" />
    </template>

    <CollapseContainer title="最多搜索">
      <div :class="`${prefixCls}__container`">
      <a-list >
        <template v-for="item in list" :key="item.id">
          <a-list-item>
            <a-list-item-meta>
              <template #description>
                <div :class="`${prefixCls}__content`">
                  {{ item.title }}
                </div>
                <div :class="`${prefixCls}__action`">
                  <div :class="`${prefixCls}__action-item`">
                    <Icon v-if="actions[0].icon" :class="`${prefixCls}__action-icon`" :icon="actions[0].icon" :color="actions[0].color" />
                    {{ item.startCount ? item.startCount : 0 }}
                  </div>
                  <div :class="`${prefixCls}__action-item`">
                    <Icon v-if="actions[1].icon" :class="`${prefixCls}__action-icon`" :icon="actions[1].icon" :color="actions[1].color" />
                    {{ item.viewCount ? item.viewCount : 0 }}
                  </div>
                  <span :class="`${prefixCls}__time`">{{ item.createTime }}</span>
                </div>
              </template>
              <template #title>
                <a :class="`${prefixCls}__title`" href="http://www.baidu.com" target="_blank">
                  {{ item.title }}
                </a>
                <div>
                  <template v-for="tag in item.description" :key="tag">
                    <Tag class="mb-2">
                      {{ tag }}233
                    </Tag>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
import { Tag } from 'ant-design-vue';
import {defineComponent, onBeforeMount, ref} from 'vue';
import Icon from '/@/components/Icon/index';
import { BasicForm } from '/@/components/Form/index';
import { actions, schemas } from './SearchPage.data';
import { PageWrapper } from '/@/components/Page';
import { List } from 'ant-design-vue';

import {getHotFileList} from "./SearchPage.api"
import { CollapseContainer } from '/@/components/Container';

export default defineComponent({
  components: {
    Icon,
    Tag,
    BasicForm,
    PageWrapper,
    CollapseContainer,
    [List.name]: List,
    [List.Item.name]: List.Item,
    AListItemMeta: List.Item.Meta,
  },
  setup() {
    let fileList = ref([]);

    onBeforeMount(() => {
      getHotFileList({pageNo: 1, pageSize: 10, column: "viewCount", order: "desc"}).then(res => {
        fileList.value = res.records;
      })
    });


    return {
      prefixCls: 'list-search',
      list: fileList,
      actions,
      schemas,
    };
  },
});






</script>






<style lang="less" scoped>
.list-search {
  &__header {
    &-form {
      margin-bottom: -16px;
    }
  }

  &__container {
    padding: 12px;
    background-color: @component-background;
  }

  &__title {
    margin-bottom: 12px;
    font-size: 18px;
  }

  &__content {
    color: @text-color-secondary;
  }

  &__action {
    margin-top: 10px;

    &-item {
      display: inline-block;
      padding: 0 16px;
      color: @text-color-secondary;

      &:nth-child(1) {
        padding-left: 0;
      }

      &:nth-child(1),
      &:nth-child(2) {
        border-right: 1px solid @border-color-base;
      }
    }

    &-icon {
      margin-right: 3px;
    }
  }

  &__time {
    position: absolute;
    right: 20px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
