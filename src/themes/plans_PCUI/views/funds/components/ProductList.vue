<template>
    <div class='listWrap'>
        <div class='item listHead'>
            <span class='cell name'>
                {{ $t('trade.name') }}
            </span>
            <span class='cell btns'>
                {{ $t('trade.operating') }}
            </span>
        </div>
        <div ref='productListEl' class='items'>
            <div v-for='item in props.list' :key='item.id' class='item li'>
                <span class='name'>
                    {{ item.symbolName }}
                </span>
                <div class='btns'>
                    <span class='btn' @click='onSelect(item)'>
                        {{ $t('transRecords.select') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    tradeType: {
        type: String,
        default: ''
    }
})

const emit = defineEmits('onSelect')

const onSelect = product => {
    emit('onSelect', product)
}

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.listWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    font-size: rem(30px);
    line-height: rem(32px);
    overflow: hidden;
    font-weight: 500;
    margin: 30px 0;
    max-height: 500px;
    .name{
        flex: 1;
        color: var(--color);
        @include ellipsis();
    }
    .btns{
        text-align: right;
    }
    .item{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        user-select: none;
    }
    .listHead{
        width: 100%;
        font-size: 14px;
        color: var(--minorColor);
        line-height: 16px;
        margin-bottom: 17px;
    }
    .items{
        width: 100%;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        .li {
            width: 100%;
            height: 48px;
            line-height: 48px;
            font-size: 14px;
            border-top: 1px solid var(--assistColor);
            &:last-child{
                border-bottom: 1px solid var(--assistColor);
            }
            .name{
                font-weight: 400;
            }
        }
        .btns{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .btn{
                height: 32px;
                line-height: 32px;
                border-radius: 4px;
                text-align: right;
                font-size: 14px;
                font-weight: 400;
                cursor: pointer;
            }
        }
    }

}
</style>
