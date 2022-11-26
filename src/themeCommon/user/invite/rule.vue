<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :title='$t("invite.rule")' />
        <div class='content'>
            <p class='t3'>
                {{ $t("invite.ruleContent") }}
            </p>
            <p class='t2'>
                {{ $t("invite.spot") }}
            </p>
            <table border='1' class='table'>
                <tr>
                    <th>{{ $t("invite.netDeposit") }}</th>
                    <th>{{ $t("invite.rate") }}</th>
                    <th>{{ $t("invite.inviteRate") }}</th>
                    <th>{{ $t("invite.rebackRate") }}</th>
                </tr>
                <tr>
                    <td rowspan='3'>
                        &lt;5000u
                    </td>
                    <td rowspan='3'>
                        20%
                    </td>
                    <td>20%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>15%</td>
                    <td>5%</td>
                </tr>
                <tr>
                    <td>10%</td>
                    <td>10%</td>
                </tr>

                <tr>
                    <td rowspan='5'>
                        ≥5000u
                    </td>
                    <td rowspan='5'>
                        40%
                    </td>
                    <td>40%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>35%</td>
                    <td>5%</td>
                </tr>
                <tr>
                    <td>30%</td>
                    <td>10%</td>
                </tr>
                <tr>
                    <td>25%</td>
                    <td>15%</td>
                </tr>
                <tr>
                    <td>20%</td>
                    <td>20%</td>
                </tr>
            </table>

            <p class='t1'>
                {{ $t("invite.c1") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c2") }}
            </p>
            <br />
            <p class='t2'>
                {{ $t("invite.fund") }}
            </p>
            <table border='1' class='table'>
                <tr>
                    <th>{{ $t("invite.netDeposit") }}</th>
                    <th>{{ $t("invite.rate") }}</th>
                    <th>{{ $t("invite.inviteRate") }}</th>
                    <th>{{ $t("invite.rebackRate") }}</th>
                </tr>
                <tr>
                    <td rowspan='2'>
                        &lt;5000u
                    </td>
                    <td rowspan='2'>
                        10%
                    </td>
                    <td>10%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>5%</td>
                    <td>5%</td>
                </tr>

                <tr>
                    <td rowspan='3'>
                        ≥5000u
                    </td>
                    <td rowspan='3'>
                        20%
                    </td>
                    <td>20%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>15%</td>
                    <td>5%</td>
                </tr>
                <tr>
                    <td>10%</td>
                    <td>10%</td>
                </tr>
            </table>
            <p class='t1'>
                {{ $t("invite.c3") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c4") }}
            </p>
            <br />

            <p class='t2'>
                {{ $t("invite.send") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c5") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c6") }}
            </p>
            <br />

            <p class='t2'>
                {{ $t("invite.c7") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c8") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c9") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c10") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c11") }}
            </p>
            <p class='t1'>
                {{ $t("invite.c12") }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    background: var(--contentColor);
    .content {
        padding: rem(30px);
        .table {
            margin: rem(20px);
            text-align: center;
            background-color: var(--bgColor);
            border: 1px solid #DDD;
            border-collapse: collapse;
            td,
            th {
                padding: rem(10px);
                border-right: solid 1px #DDD;
                border-bottom: solid 1px #DDD;
            }
            th {
                padding: rem(20px);
                color: #999;
                font-weight: bold;
            }
        }
        .t1 {
            margin: rem(20px) 0;
            padding-left: rem(20px);
            color: #666;
        }
        .t2 {
            margin: rem(20px) 0;
            font-weight: bold;
            font-size: rem(30px);
        }
        .t3 {
            margin: rem(20px) 0;
            color: #666;
            line-height: rem(50px);
        }
    }
}
</style>
