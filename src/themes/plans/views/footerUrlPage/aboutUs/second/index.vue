<template>
    <div>
        <div class='banner'>
            <p class='title'>
                Provide safe, reliable and <br /> high-quality services
            </p>
            <p class='banner-desc width1'>
                <img alt='' src='../../../../images/aboutus/bannerIcon1.png' />
                Safety first
            </p>
            <br />
            <p class='banner-desc width2'>
                <img alt='' src='../../../../images/aboutus/bannerIcon2.png' />
                Users first
            </p>
            <br />
            <p class='banner-desc  width3'>
                <img alt='' src='../../../../images/aboutus/bannerIcon3.png' />
                Stable and transparent
            </p>
        </div>
        <!-- Audit -->
        <div class='module'>
            <h2 class='module-title'>
                Audit by Certik
            </h2>
            <div class='row bgGrey'>
                <span class='col'>
                    Date
                </span>
                <span class='col'>
                    Audit company
                </span>
            </div>
            <div class='row bgWhite'>
                <span class='col'>
                    September, 2022
                </span>
                <span class='col'>
                    Certik
                </span>
            </div>
            <div class='row bgGrey'>
                <span class='col'>
                    Report
                </span>
                <span class='col'>
                    Website
                </span>
            </div>
            <div class='row bgWhite'>
                <span class='col'>
                    <a class='link' href='https://www.vitatoken.io/site/REP-Vitatoken-Pentest__final-20221003T170329Z.pdf'>
                        MagnaMarkets Pentest
                    </a>
                </span>
                <span class='col'>
                    <a class='link' href='https://www.certik.com/projects/vitatoken#audit'>
                        Find it in Certik
                    </a>
                </span>
            </div>
        </div>
        <!-- CEZA -->
        <div class='module CEZA'>
            <h2 class='module-title'>
                CEZA virtual currency exchange license
            </h2>
            <img alt='' class='CEZA-img' src='../../../../images/aboutus/photo.png' />
            <span class='more'>
                <a class='link' href='https://ceza.gov.ph/article/ceza-welcomes-vitatoken-under-dragon-empire-developments-limited'>
                    Find it in CEZA >
                </a>
            </span>
        </div>
        <!-- MSB -->
        <div class='module'>
            <h2 class='module-title'>
                MSB registration status information
            </h2>
            <div class='row bgGrey'>
                <span class='col'>
                    MSB registration number
                </span>
                <span class='col'>
                    MSB activities
                </span>
            </div>
            <div class='row bgWhite'>
                <span class='col'>
                    31000218269736
                </span>
                <span class='col'>
                    Dealer in foreign exchange, Money transmitter, Seller of money orders
                </span>
            </div>
            <div class='row bgGrey'>
                <span class='col'>
                    Report
                </span>
                <span class='col'>
                    Website
                </span>
            </div>
            <div class='row bgWhite'>
                <span class='col'>
                    <a class='link' href='https://www.vitatoken.io/site/msb_registration.pdf'>
                        MSB_registration
                    </a>
                </span>
                <span class='col'>
                    <a class='link' href='https://www.fincen.gov/msb-registrant-search'>
                        Find it in FinCEN
                    </a>
                </span>
            </div>
        </div>
        <!-- Registered -->
        <div class='module'>
            <h2 class='module-title'>
                Registered MagnaMarkets as a trademark
            </h2>
            <div class='row bgGrey'>
                <span class='col'>
                    Applicant
                </span>
                <span class='col'>
                    Number
                </span>
            </div>
            <div class='row bgWhite'>
                <span class='col'>
                    Dragon Empire Developments Limited
                </span>
                <span class='col'>
                    42022512790
                </span>
            </div>
            <div class='row bgGrey'>
                <span class='col'>
                    Image
                </span>
                <span class='col'>
                    Website
                </span>
            </div>
            <div class='row bgWhite'>
                <span class='col'>
                    <img alt='' class='logo_vitamin' src='/images/logo_vitamin.png' />
                </span>
                <span class='col'>
                    <a class='link' href='https://branddb.wipo.int/branddb/ph/en/'>
                        Find it in Datebase
                    </a>
                </span>
            </div>
        </div>
        <!-- partners -->
        <div class='module'>
            <h2 class='module-title'>
                In our partners
            </h2>
            <Partners />
        </div>
        <!-- media -->
        <div class='module'>
            <h2 class='module-title'>
                In the media
            </h2>
            <Media />
        </div>
        <div class='module clients'>
            <h2 class='module-title'>
                In our clients
            </h2>
            <clients />
        </div>
    </div>
</template>

<script setup>
import Partners from './partners.vue'
import Clients from './clients.vue'
import Media from './media.vue'
</script>

<style lang='scss' scoped>
.banner {
    background-image: url('../../../../images/aboutus/Maskgroup.png');
    background-size: 100% 100%;
    padding-top: rem(227px);
    margin-top: rem(40px);
    height: rem(749px);
    text-align: center;
    .title {
        font-weight: 600;
        font-size: rem(48px);
        color: #FFF;
        margin-bottom: rem(60px);
    }
    .banner-desc {
        white-space: nowrap;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: rem(2px) solid rgba(255, 255, 255, 0.5);
        border-radius: rem(4px);
        font-weight: 400;
        font-size: rem(24px);
        line-height: rem(48px);
        color: #FFF;
        padding: rem(10px) rem(20px);
        margin-bottom: rem(20px);
        img {
            margin-right: rem(14px);
            height: rem(32px);
        }
        &.width1 {
            min-width: rem(210px);
        }
        &.width2 {
            min-width: rem(210px);
        }
        &.width3 {
            min-width: rem(340px);
        }
    }
}
.module {
    padding: rem(40px) rem(30px) 0;
    &-title {
        font-size: rem(48px);
        margin-bottom: rem(32px);
        text-align: center;
    }
    &.clients {
        background: #F4F5F9;
        margin-top: rem(40px);
    }
}
.row {
    display: flex;
    width: 100%;
    border-right: 1px solid #DCDCDC;
    border-bottom: 1px solid #DCDCDC;
    text-align: center;
    &.bgGrey {
        background: #F4F5F9;
        .col {
            padding: rem(25px) 0;
            text-align: center;
            font-size: rem(32px);
            font-weight: 500;
        }
    }
    &.bgWhite {
        background: #FFF;
        .col {
            padding: rem(20px);
            min-height: rem(125px);
            border-top: 0;
            font-size: rem(28px);
        }
    }
    .col {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        border: 1px solid #DCDCDC;
        border-right: 0;
        border-bottom: 0;
        .link {
            color: #0062FF;
        }
        .logo_vitamin {
            width: rem(200px);
        }
    }
}
.CEZA {
    background: #F4F5F9;
    margin-top: rem(40px);
    padding: rem(40px) rem(30px);
    text-align: center;
    &-img {
        display: block;
        width: rem(340px);
        margin: rem(32px) auto;
    }
    .more {
        display: inline-block;
        padding: 10px 15px;
        margin: auto;
        background-color: #FFF;
        font-weight: 500;
        font-size: rem(32px);
        border-radius: rem(4px);
        line-height: rem(40px);
        color: #0062FF;
        .link {
            color: #0062FF;
        }
    }
}
</style>
