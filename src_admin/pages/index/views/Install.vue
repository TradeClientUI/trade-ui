<template>
    <div class='m-install'>
        <vue-particles
            class='particles'
            :click-effect='true'
            click-mode='push'
            color='#999'
            :hover-effect='true'
            hover-mode='grab'
            :line-linked='true'
            :line-opacity='0.4'
            lines-color='#dedede'
            :lines-distance='150'
            :lines-width='1'
            :move-speed='3'
            :particle-opacity='0.7'
            :particle-size='4'
            :particles-number='80'
            shape-type='circle'
        />
        <div class='toSysSetting'>
            <router-link :to="{ name: 'Setting' }">
                {{ $t('install.label1') }}
            </router-link>
        </div>
        <div v-if="type == 'uploadFile'" class='inputFile'>
            <div class='title'>
                {{ $t('install.label2') }}
            </div>
            <el-upload
                accept='.xlsx, .xls'
                action=''
                :auto-upload='false'
                class='upload'
                drag
                :multiple='false'
                :on-change='onChange'
                :show-file-list='false'
            >
                <i class='el-icon-upload'></i>
                <div class='el-upload__text'>
                    {{ $t('install.label3') }}
                </div>
                <div class='el-upload__text'>
                    {{ $t('install.label4') }}<em>{{ $t('install.label5') }}</em>
                </div>
            </el-upload>
        </div>
        <div v-show="type == 'install'" class='progeress'>
            <div class='showInfo'>
                <div ref='infoBg' class='bg'>
                    <svg
                        viewBox='0 0 1100 800'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <g fill='none' fill-rule='evenodd'>
                            <path
                                d='M781.02 488.77v69.78c0 1.08-.88 1.96-1.97 1.96l-135.12-.04c-1.09 0-2.6.62-3.38 1.39l-39.23 38.96a5.52 5.52 0 0 1-3.37 1.4h-75.38a1.97 1.97 0 0 1-1.97-1.97v-33.5'
                                stroke='#31B495'
                            />
                            <path
                                d='M674.88 355.57l45.54-45.24a5.42 5.42 0 0 0 1.39-3.35l-.06-10.38c0-1.08-.63-2.58-1.4-3.35l-43.38-43.07a1.94 1.94 0 0 1 0-2.77l82.83-82.25a5.52 5.52 0 0 1 3.37-1.4l44.94.1c1.08 0 2.6-.62 3.37-1.37L952.5 22.65'
                                stroke='#F4D21F'
                            />
                            <path
                                d='M507-76.68v265.47a4 4 0 0 0 4 3.99H566c1.08 0 1.97.88 1.97 1.96v147.5c0 1.08-.63 2.59-1.4 3.35l-47.9 47.4a5.45 5.45 0 0 0-1.4 3.34c0 2.25.64 3.76 1.4 4.53l53.82 53.26c.77.76 1.76 1.39 2.19 1.39.43 0 .79.88.79 1.96v70.17c0 1.07-.89 1.96-1.97 1.96l-85.81-.04c-1.09 0-2.6.62-3.38 1.39l-1.55 1.54a5.52 5.52 0 0 1-3.38 1.4h-9.29'
                                stroke='#1AACA8'
                            />
                            <path
                                d='M8 127.82v391.06a4.04 4.04 0 0 0 4 4.04L140.8 524'
                                stroke='#1F8C43'
                            />
                            <path
                                d='M894.01 374l49.8-49.44a5.52 5.52 0 0 1 3.37-1.4h92.41c1.09 0 2.6.63 3.38 1.4l27.18 26.99'
                                stroke='#1AA5D0'
                            />
                            <path
                                d='M894.01 374l49.8-49.44a5.52 5.52 0 0 1 3.37-1.4h92.41c1.09 0 2.6.63 3.38 1.4l27.18 26.99'
                                stroke='#1AA5D0'
                            />
                            <path
                                d='M755.16 213.9l70.82.04c1.08 0 2.6-.63 3.37-1.4l91.61-90.97a5.52 5.52 0 0 1 3.37-1.39h77.07l-71.29-72.13a5.45 5.45 0 0 1-1.4-3.35V16.87'
                                stroke='#1F8C43'
                            />
                            <path
                                d='M261.78-52.44l11.16 11.08c.77.77 1.4 2.28 1.4 3.35V-5L156.7 111.03l-85.4 84.8a5.45 5.45 0 0 0-1.4 3.35v100.67c0 1.08.89 1.96 1.97 1.96h50.4c1.09 0 1.98.88 1.98 1.96l.07 26.92c0 1.07.9 1.96 1.98 1.96l335.73.13c1.09 0 1.98.88 1.98 1.96v36.79l-42.99 43.78a5.52 5.52 0 0 1-3.37 1.4H385.2'
                                stroke='#9DCA40'
                            />
                            <path
                                d='M564.8 549.64v17.76c0 1.08-.64 2.59-1.4 3.35L382.28 750.6a5.52 5.52 0 0 1-3.38 1.39h-109.1c-1.09 0-1.97.88-1.97 1.96v23.37c0 1.07-.9 1.96-1.98 1.96h-83.54c-1.08 0-1.97.88-1.97 1.96v45.8c0 1.07.89 1.95 1.97 1.95h29.89c1.08 0 1.97.88 1.97 1.96v51.07c0 1.08.63 2.59 1.4 3.35l10.32 10.25c.77.76 2.29 1.39 3.37 1.39h111.77c1.09 0 1.34.62.57 1.39M482.82 656H630.9'
                                stroke='#DA5A98'
                            />
                            <path
                                d='M440.53 245.87l-31.7 31.48a5.52 5.52 0 0 1-3.37 1.39h-62.37c-1.09 0-2.6.62-3.38 1.39l-2.68 3.66-264.59.02c-1.08 0-2.6-.63-3.37-1.4l-47.3-46.97a5.52 5.52 0 0 0-3.37-1.39h-57.47l-1.12-34.61c0-1.08-.63-2.59-1.4-3.35l-66.54-65.94'
                                stroke='#E5683E'
                            />
                            <path
                                d='M705.31 221.73h7.83c1.09 0 2.6.63 3.37 1.4l45.8 45.6c.78.76 1.4 2.27 1.4 3.35v13.94c0 1.08.46 1.96 1.03 1.98.56 0 1.03.9 1.03 1.98v10.77l-.15 110.84c0 1.08-.89 1.96-1.98 1.96H628.32c-1.08 0-2.6-.63-3.37-1.4l-12.2-12.12a5.52 5.52 0 0 0-3.38-1.39h-46.18a2 2 0 0 0-2 1.96l-.17 26.74c0 1.08-.63 2.59-1.4 3.35l-8.82 8.76a5.52 5.52 0 0 1-3.37 1.39l-26.65-.06c-1.09 0-2.6.62-3.38 1.39l-48.1 47.78a5.52 5.52 0 0 1-3.38 1.39h-16.37l-79.45-.02c-1.09 0-2.6.63-3.36 1.39L220.71 639.06a5.47 5.47 0 0 1-3.35 1.4H31.06'
                                stroke='#9F83B6'
                            />
                            <path
                                d='M145.43 99.41L289.6 243.5c.77.76 2.29 1.39 3.37 1.39h146.76c1.09 0 2.6.62 3.38 1.39l31.93 31.71c.77.77 1.4 2.27 1.4 3.35V474.1c0 1.08-.63 2.59-1.4 3.35l-7.6 7.54a5.52 5.52 0 0 1-3.36 1.4h-20.62l-20.67 20.97-2.78 2.78L289.37 640a5.45 5.45 0 0 0-1.4 3.35l.16 177.85'
                                stroke='#BC6D21'
                            />
                            <path
                                d='M318.82 380.62h94.88c1.09 0 2.6.63 3.38 1.39l14.97 14.87c.77.76 2.29 1.39 3.37 1.39h72.99c1.08 0 2.6.63 3.35 1.39l58.57 58.53c.77.77 2.27 1.4 3.35 1.4h103.37c1.08 0 1.97-.89 1.97-1.97v-14.7c0-1.09-.89-1.97-1.97-1.97l-6.7.02H630.1a1.97 1.97 0 0 1-1.97-1.96v-57c0-1.08-.63-2.59-1.4-3.35l-14.58-14.48a5.45 5.45 0 0 1-1.4-3.35v-17.3c0-1.07-.63-2.58-1.4-3.34L597 327.92a5.52 5.52 0 0 0-3.37-1.39h-17.4c-1.09 0-2.6-.62-3.38-1.39l-41.8-41.5a5.52 5.52 0 0 0-3.37-1.4h-41.34'
                                stroke='#DA1817'
                            />
                            <path stroke='#9F9FA0' />
                            <path
                                d='M855.2 194.4h59.84c1.09 0 1.97.89 1.97 1.96v28.74c0 1.08.64 2.59 1.4 3.35l50.96 50.6c.77.76 1.4 2.27 1.4 3.35v101.47l105.2 104.27'
                                stroke='#74BB63'
                            />
                            <path
                                d='M638.46 305.73L651 293.29c.77-.74.77-2 0-2.76l-31.35-31.13c-.76-.74-.76-2 0-2.76l18.53-18.4a5.52 5.52 0 0 1 3.37-1.39l160.41-.2 423.37 1.2c1.08 0 1.97.89 1.97 1.96v71.5'
                                stroke='#DA5A98'
                            />
                            <path
                                d='M438.61 486.03h-18.54c-1.08 0-2.6-.63-3.37-1.4l-74.94-74.41a5.52 5.52 0 0 0-3.37-1.4h-38.57c-1.08 0-2.6-.62-3.37-1.38l-47-46.68-36.58-.04-57 71.59a5.45 5.45 0 0 0-1.4 3.35v23.9'
                                stroke='#BC6D21'
                            />
                            <path
                                d='M882.06 358.97l-46.92 46.6a5.52 5.52 0 0 1-3.38 1.39h-94.64c-1.09 0-2.6-.63-3.38-1.4l-30.6-30.33a5.52 5.52 0 0 0-3.36-1.4l-34.94.04c-1.08 0-2.6.63-3.37 1.4l-29.57 29.36a5.52 5.52 0 0 1-3.37 1.39l-14.55-14.35a5.63 5.63 0 0 0-3.42-1.4l-156.97-.25c-1.11 0-2.65.63-3.43 1.4l-27.85 27.61a5.52 5.52 0 0 1-3.38 1.4H-23.82l-88.65.2-12.44 12.35'
                                stroke='#74BB63'
                            />
                            <path
                                d='M292.9 643.74l59.56-59.12a5.52 5.52 0 0 1 3.37-1.39h23.93c1.08 0 2.6-.63 3.37-1.39l46.53-46.21a5.52 5.52 0 0 1 3.38-1.4h33.53l153.67-.01c1.08 0 1.97-.88 1.97-1.96V420.01c0-1.07-.63-2.58-1.4-3.35l-38.64-38.37a5.45 5.45 0 0 1-1.4-3.35v-51.52c0-1.08-.64-2.59-1.4-3.35L468.91 210.39a5.52 5.52 0 0 0-3.38-1.4l-180.49.2'
                                stroke='#2283BC'
                            />
                            <path
                                d='M484.13 548.71h-37.09c-1.08 0-2.6.63-3.37 1.4l-69.02 68.54c-.77.76-.77 2 0 2.76l28.09 27.78c.77.76 2.29 1.39 3.37 1.39h62.41'
                                stroke='#DA5A98'
                            />
                            <path
                                d='M520.82 561.7v-4.74c0-1.08-.89-1.96-1.98-1.96h-13.21c-1.09 0-2.6-.62-3.37-1.39l-43.36-42.88a5.45 5.45 0 0 1-1.4-3.35v-190.4c0-1.08.63-2.6 1.4-3.36l20.89-20.74a5.45 5.45 0 0 0 1.4-3.35v-95.4c0-1.08-.63-2.58-1.4-3.35L292.4 4.7l-.6-40.88c0-1.08-.62-2.58-1.4-3.35L278.8-51.07'
                                stroke='#31B495'
                            />
                            <path
                                d='M275.76 745h99.28c1.09 0 2.6-.63 3.38-1.4l174.33-172.75a5.52 5.52 0 0 1 3.38-1.4h46.75c1.08 0 2.6-.62 3.35-1.38l51.47-51.46a5.42 5.42 0 0 0 1.38-3.35V311.29c0-1.07-.63-2.58-1.4-3.35l-51.84-51.3a5.52 5.52 0 0 0-3.38-1.4h-17.95a1.97 1.97 0 0 1-1.97-1.95v-44.47c0-1.07-.89-1.96-1.97-1.96h-88.63a1.97 1.97 0 0 1-1.97-1.96v-19.2c0-1.07-.64-2.58-1.4-3.34L309.87 4.92'
                                stroke='#1EB2D8'
                            />
                            <path
                                d='M1002.65 123.83H926.5c-1.08 0-2.6.62-3.37 1.39l-92.28 91.46a5.52 5.52 0 0 1-3.37 1.39l-131.87-.08c-1.09 0-2.6.63-3.37 1.37l-51.9 51.19c-.77.76-.77 2 0 2.76l21.22 21.1c.77.76 1.4 2.27 1.4 3.35v15.69'
                                stroke='#F4D21F'
                            />
                            <path
                                d='M672.51 437.64h54.25c1.08 0 2.6.63 3.37 1.4l49.04 48.7c.77.76 2.29 1.38 3.37 1.38h45.16c1.08 0 2.6-.62 3.37-1.39L914.39 405a5.52 5.52 0 0 1 3.37-1.4h42.22c1.08 0 2.6.63 3.37 1.4l100.8 100.1'
                                stroke='#BE2F39'
                            />
                            <path
                                d='M672.51 434.31h55.63c1.08 0 2.6.63 3.37 1.4l49.14 48.8c.77.76 2.29 1.38 3.37 1.38l41.9-.04c1.08 0 2.6-.62 3.37-1.39l62.08-61.68a5.45 5.45 0 0 0 1.4-3.35l-.1-268.18c0-1.08-.63-2.59-1.4-3.35l-99.8-99.28a5.52 5.52 0 0 0-3.37-1.39H422.62c-1.08 0-2.6.63-3.37 1.4L260.28 206.3a5.52 5.52 0 0 1-3.38 1.39H127.3c-1.08 0-2.6.62-3.37 1.39l-36.71 36.45a5.45 5.45 0 0 0-1.4 3.35v185.1'
                                stroke='#E5683E'
                            />
                            <path
                                d='M410.1 713.73l17.53 17.42c.77.76 2.29 1.39 3.37 1.39h42.02c1.09 0 2.6-.63 3.37-1.4l26.02-25.83 123.2-.31'
                                stroke='#1EB2D8'
                            />
                            <path />
                            <path
                                d='M307.34 907.08c.77-.77.52-1.4-.57-1.4H108.29a1.97 1.97 0 0 1-1.98-1.95V743.59c0-1.08.9-1.96 1.98-1.96h264.38c1.09 0 2.6-.63 3.38-1.4l23.75-23.58c.77-.76.77-2 0-2.76l-80.84-80.1c-.77-.76-.51-1.4.57-1.4h137.53c1.09 0 2.6-.62 3.38-1.38l53.63-53.26a5.52 5.52 0 0 1 3.37-1.4l88.57-.2c1.09 0 2.6-.62 3.38-1.38l55.6-55.22a5.45 5.45 0 0 0 1.4-3.35V409.93c0-1.08.9-1.96 1.98-1.96h29c1.08 0 2.6-.63 3.37-1.4l43.32-43.01a5.52 5.52 0 0 1 3.37-1.4h6.11c1.09 0 2.6-.62 3.38-1.38l53.12-52.76a5.52 5.52 0 0 1 3.37-1.39h13.6c1.08 0 2.6.63 3.37 1.4L892.79 370c.77.77 2.29 1.4 3.37 1.4h74.06c1.08 0 2.6.62 3.37 1.38l93.97 93.5'
                                stroke='#2283BC'
                            />
                            <path
                                d='M647.56 429.46v-33.62c0-1.08-.63-2.59-1.4-3.35l-31.45-31.22a5.52 5.52 0 0 0-3.37-1.4h-36.87c-1.08 0-2.6.63-3.37 1.4l-74.35 73.83a5.52 5.52 0 0 1-3.37 1.39H440.9a1.97 1.97 0 0 1-1.98-1.96v-71.5c0-1.08-.88-1.96-1.97-1.96H9.3c-1.08 0-2.6.63-3.37 1.4l-37.9 37.62a5.52 5.52 0 0 1-3.37 1.4h-57c-1.1 0-2.61.62-3.38 1.38l-13.2 13.1a5.52 5.52 0 0 1-3.37 1.4h-13.2'
                                stroke='#E6632A'
                            />
                            <path
                                d='M219.9 357h144.49l76.54.13c1.08 0 1.97.88 1.97 1.96v71.7c0 1.08.89 1.96 1.97 1.96h46.36c1.08 0 2.6-.63 3.37-1.4l74.35-74a5.52 5.52 0 0 1 3.37-1.4h192.33c1.09 0 2.6-.62 3.37-1.38l43.58-43.28a5.52 5.52 0 0 1 3.37-1.39h10.6c1.08 0 2.6.63 3.37 1.4l62.65 62.2c.77.77 2.29 1.4 3.37 1.4h73.87c1.09 0 2.6.63 3.38 1.4l94.12 93.47 9.27.57c.84 0 2.17-.62 2.93-1.39l104.08-89.36a1.97 1.97 0 0 1 2.78 0l6.3 6.25'
                                stroke='#F4D21F'
                            />
                            <path
                                d='M599.92 564.19a6.6 6.6 0 0 0 4.04-1.67l47.94-47.6a6.5 6.5 0 0 0 1.67-4.01V313.84c0-1.3-.75-3.1-1.67-4.02l-47.94-47.6a6.6 6.6 0 0 0-4.04-1.66h-97.84a6.6 6.6 0 0 0-4.05 1.66l-47.93 47.6a6.5 6.5 0 0 0-1.68 4.02v197.07c0 1.29.75 3.1 1.68 4.01l47.93 47.6a6.6 6.6 0 0 0 4.05 1.67h97.84z'
                                stroke='#9DCA40'
                            />
                            <path
                                d='M648.25 527.17v33.3c0 1.08-.63 2.58-1.4 3.35l-87.37 86.76c-.77.76-.51 1.39.57 1.39h70.82'
                                stroke='#1EB2D8'
                            />
                            <path
                                d='M476.04 273.32v-18.86c0-1.08-.63-2.59-1.4-3.35l-30.9-30.68a5.52 5.52 0 0 0-3.37-1.4H274.62'
                                stroke='#BC6D21'
                            />
                            <path
                                d='M923.43 372.6V119.09c0-1.07-.64-2.58-1.4-3.34L757.4-47.74a5.52 5.52 0 0 0-3.37-1.39H351.57c-1.09 0-2.6.63-3.38 1.4L310.5-10.3'
                                stroke='#9F83B6'
                            />
                            <path
                                d='M317-49.77L304.42-37.3a5.58 5.58 0 0 0-1.42 3.35l-.36 21.45a5.3 5.3 0 0 0 1.36 3.35L493.36 178.9c.77.76 1.4 2.27 1.4 3.35v18.41c0 1.08.89 1.96 1.97 1.96h87.86c1.09 0 1.98.88 1.98 1.96v34.67c0 1.08.88 1.96 1.97 1.96h23.3c1.08 0 2.6.63 3.37 1.4l46.16 45.83c.77.77 1.4 2.28 1.4 3.35v138.64l.07 84.4c0 1.08-.63 2.6-1.38 3.35l-53.63 53.27a5.52 5.52 0 0 1-3.37 1.39H557.9c-1.08 0-2.6.63-3.37 1.39L380.57 746.98a5.52 5.52 0 0 1-3.38 1.39H112.47c-1.09 0-1.97.88-1.97 1.96v93.24c0 1.08-.9 1.96-1.98 1.96h-224.54'
                                stroke='#ED8E3F'
                            />
                            <path
                                d='M415.07 612.97l63.3-62.86a5.52 5.52 0 0 1 3.37-1.4h124.67c1.08 0 2.6-.6 3.37-1.37l28.23-27.83a5.35 5.35 0 0 0 1.4-3.33V478.2c0-1.07.89-1.96 1.97-1.96H694c1.09 0 1.97-.88 1.97-1.95v-52.11c0-1.08.64-2.59 1.4-3.35l29.57-29.37a5.45 5.45 0 0 0 1.4-3.35v-76c0-1.08.9-1.96 1.98-1.96h37.9a4 4 0 0 0 4-4v-29.3c0-1.08.63-2.59 1.4-3.35l35.35-35'
                                stroke='#DA5A98'
                            />
                            <path
                                d='M893.1 374.7L847.5 420a5.52 5.52 0 0 1-3.37 1.38H618.66c-1.09 0-2.6-.62-3.37-1.39l-81.65-81.08a5.52 5.52 0 0 0-3.37-1.39H384.49c-1.08 0-2.6.63-3.37 1.4l-17.14 17.02'
                                stroke='#1AA5D0'
                            />
                            <path
                                d='M288.52 640.2h-46.9c-1.09 0-1.98.88-1.98 1.95v26.65c0 1.07-.89 1.95-1.97 1.95h-89.32'
                                stroke='#55B549'
                            />
                            <path
                                d='M281.34 229.6l9.65 9.59c.77.76 2.29 1.39 3.37 1.39l146.76-.2c1.09 0 2.6.63 3.38 1.37l115.95 114c.77.76.77 1.99 0 2.75l-37.2 37.05a1.96 1.96 0 0 0 0 2.78l49.62 49.28c.77.77 2.3 1.4 3.38 1.4h138.28c1.08 0 2.6.62 3.37 1.39l37.26 37c.77.76 2.3 1.4 3.38 1.4h21.7'
                                stroke='#D3C452'
                            />
                            <path
                                d='M-116.02 841.87h216.77c1.09 0 1.97-.89 1.97-1.96v-99.83c0-1.08.9-1.96 1.98-1.96h266.24c1.08 0 2.6-.62 3.37-1.39l20.18-20.04c.77-.76.77-2.02 0-2.76l-78.7-78.2a5.45 5.45 0 0 1-1.4-3.35v-1.57c0-1.07.88-1.96 1.97-1.96l139.22.02c1.09 0 2.6-.62 3.38-1.39l53.7-53.48a4.86 4.86 0 0 1 2.8-1.39c.76 0 1.41-.88 1.41-1.96v-6.62'
                                stroke='#9DCA40'
                            />
                            <path
                                d='M317.92 257.82l73.16 72.65c.77.77 1.4 2.27 1.4 3.35v45.25c0 1.08.63 2.59 1.4 3.35l12.02 11.93c.77.77 2.28 1.4 3.37 1.4h9.86c1.09 0 2.6-.63 3.38-1.4l6.29-6.25a5.52 5.52 0 0 1 3.37-1.39h85.81c1.08 0 2.6-.62 3.37-1.39l63.1-62.66a5.52 5.52 0 0 1 3.38-1.4h161.56c1.08 0 1.97.89 1.97 1.96v178.66c0 1.07-.63 2.58-1.4 3.35l-11.42 11.34a5.52 5.52 0 0 1-3.38 1.39H529.03a1.97 1.97 0 0 1-1.98-1.96v-73.07c0-1.07-.88-1.96-1.97-1.96h-88.26a1.97 1.97 0 0 1-1.97-1.95V406.5c0-1.08-.89-1.96-1.97-1.96-1.99 0-3.5-.63-4.28-1.4l-7.44-7.38'
                                stroke='#B00D7C'
                            />
                            <path
                                d='M650.42-78.35v211.36c0 1.08.63 2.59 1.4 3.35l46.73 46.4c.77.77 1.4 2.28 1.4 3.36v35.79l-2.49-.14c-.75 0-1.97.63-2.74 1.4l-18.32 18.19a5.45 5.45 0 0 0-1.4 3.35v116.95c0 1.07.63 2.58 1.38 3.35l46.53 46.58a5.42 5.42 0 0 1 1.38 3.35l-.02 30.34c0 1.08-.63 2.59-1.4 3.35l-4.91 4.88a5.52 5.52 0 0 1-3.37 1.4H599.52c-1.08 0-1.97.87-1.97 1.95v36c0 1.08-.89 1.96-1.97 1.96h-92.71c-1.09 0-2.6.63-3.38 1.4l-19.58 19.45a5.52 5.52 0 0 1-3.38 1.39h-63.61'
                                stroke='#DA5A98'
                            />
                            <path
                                d='M281.48 745v84.33c0 1.08-.89 1.96-1.97 1.96h-57.48c-1.09 0-1.98.88-1.98 1.96v10.36c0 1.08-.88 1.96-1.97 1.96H110.52'
                                stroke='#1EB2D8'
                            />
                            <path
                                d='M10.95 362.32l113.4 112.62c.78.77 2.3 1.4 3.38 1.4h36.12c1.08 0 2.6.62 3.37 1.38l205.45 204.03c.77.76 2.29 1.39 3.37 1.39l62.74.03h29.53c1.09 0 2.6.63 3.37 1.4l16.36 16.23c.77.77 2.29 1.4 3.37 1.4h134.34'
                                stroke='#F5C739'
                            />
                            <path
                                d='M275.82 590.44l24.44-24.27a5.52 5.52 0 0 1 3.37-1.4h121.52c1.08 0 2.6.63 3.37 1.4l34.32 34.08c.77.77 2.3 1.4 3.38 1.4h54.36'
                                stroke='#31B495'
                            />
                            <path
                                d='M633.41 278.74l-21.36-21.22a5.45 5.45 0 0 1-1.4-3.35V-78.58'
                                stroke='#AD7D20'
                            />
                            <path
                                d='M754.4 192.02v20.11c0 1.08-.9 1.96-1.98 1.96h-94.49c-1.08 0-2.6.63-3.37 1.4l-50.28 49.93a5.45 5.45 0 0 0-1.4 3.35v56.41c0 1.08.63 2.59 1.4 3.35l10.63 10.56c.77.76 1.4 2.27 1.4 3.35v121.45c0 1.08-.89 1.96-1.97 1.96H429.6c-1.08 0-2.6-.62-3.37-1.39l-21.2-21.06-15.77 14.8a5.52 5.52 0 0 1-3.37 1.38H282.15c-1.08 0-2.6.63-3.37 1.37l-62.1 61.3a5.5 5.5 0 0 1-3.37 1.37h-69.85c-1.09 0-2.6.63-3.37 1.4l-68.22 67.73a5.52 5.52 0 0 1-3.37 1.4H34.1c-1.09 0-2.6.62-3.38 1.38l-61.64 61.22a5.45 5.45 0 0 0-1.4 3.35v98.02c0 1.08-.89 1.96-1.97 1.96h-30.76c-1.08 0-2.6.63-3.37 1.4l-48.29 47.95'
                                stroke='#1F8C43'
                            />
                            <path
                                d='M184.55 422.03v34.09c0 1.07-.63 2.58-1.4 3.35l-56.48 55.88a5.52 5.52 0 0 1-3.37 1.4H-34.6'
                                stroke='#74BB63'
                            />
                            <path
                                d='M980.12 416.59l-15.05-14.95a5.52 5.52 0 0 0-3.38-1.4h-46.04c-1.08 0-2.6.63-3.37 1.4l-14.5 14.4c-.77.76-1.4.5-1.4-.57v-34.93c0-1.08-.63-2.58-1.4-3.35l-2.48-2.47'
                                stroke='#E5683E'
                            />
                            <path
                                d='M826.77 238.25v54.43c0 1.08.63 2.59 1.4 3.35l86.38 85.78c.77.77 2.29 1.4 3.37 1.4h98.61c1.09 0 2.6-.63 3.36-1.4l22.6-22.8a5.47 5.47 0 0 1 3.36-1.39h106.38c1.08 0 1.97-.88 1.97-1.96l.04-95.24c0-1.08.89-1.96 1.97-1.96h39.02c1.09 0 1.97.88 1.97 1.96v48.1'
                                stroke='#DA5A98'
                            />
                            <path
                                d='M12.87 361.05h-5c-1.1 0-2.61-.63-3.38-1.4l-17.72-17.58a5.52 5.52 0 0 0-3.37-1.4h-16.9c-1.09 0-2.6-.62-3.38-1.38l-55.64-55.26a5.52 5.52 0 0 0-3.38-1.4h-15.19'
                                stroke='#E6632A'
                            />
                            <path
                                d='M959.23 126.08l19.2 19.06c.76.76 2.28 1.39 3.36 1.39h177.42c1.09 0 1.97.88 1.97 1.96v100.84a3 3 0 0 0 3 3h36.42c1.08 0 1.97.88 1.97 1.96v54.65'
                                stroke='#3EB373'
                            />
                            <path
                                d='M33.17 798.75h242.12c1.08 0 1.97-.88 1.97-1.96V672.9c0-1.08-.89-1.96-1.97-1.96h-30.12a1.97 1.97 0 0 1-1.98-1.96v-26.76c0-1.07-.88-1.96-1.97-1.96h-20.87'
                                stroke='#2765B0'
                            />
                            <path
                                d='M458.48 496.1h9.55c1.09 0 2.6-.63 3.37-1.4l48.23-47.83a5.52 5.52 0 0 1 3.38-1.39h24.26c1.08 0 2.6.63 3.37 1.39l23.26 23.1c.77.76 2.29 1.39 3.37 1.39h111.06c1.09 0 1.97-.88 1.97-1.96v-54.46c0-1.08-.63-2.59-1.4-3.33l-20.35-20.04-2.8-2.76-1.17-1.16a5.52 5.52 0 0 0-3.37-1.39h-11.66a1.97 1.97 0 0 1-1.97-1.96V310.6c0-1.08.88-1.96 1.97-1.96h77.38'
                                stroke='#EB9D12'
                            />
                            <path
                                d='M-34.94 402.19v111.19c0 1.07.63 2.58 1.4 3.35l49.06 48.71c.76.77 2.28 1.4 3.37 1.4h21.8c1.08 0 2.6.62 3.37 1.39l113 112.22c.78.77 2.3 1.4 3.38 1.4h170.6c1.08 0 1.97.87 1.97 1.95v60.41'
                                stroke='#9DCA40'
                            />
                        </g>
                    </svg>
                </div>
                <el-scrollbar ref='scroll' class='infoScroll'>
                    <div v-for='item in infoList' :key='item.id' class='item'>
                        <i v-if='item.loading' class='el-icon-loading'></i>
                        <i
                            v-if='item.success === true'
                            class='el-icon-success'
                        ></i>
                        <i
                            v-if='item.success === false'
                            class='el-icon-circle-close'
                        ></i>
                        <span>{{ item.info }}</span>
                    </div>
                </el-scrollbar>
            </div>
            <!-- <el-steps :active="active">
                <el-step icon="el-icon-edit" title="写入公司数据"></el-step>
                <el-step icon="el-icon-download" title="拉取公司产品"></el-step>
                <el-step
                    icon="el-icon-toilet-paper"
                    title="写入H5页面配置"
                ></el-step>
                <el-step icon="el-icon-circle-check" title="完成"></el-step>
            </el-steps> -->
        </div>
    </div>
</template>

<script>
import anime from 'animejs/lib/anime.es.js'
import { modifyPageConfig, pushPage, checkEnvironment, reloadSymbol, reloadAccountGroup, reloadAccountGroupByGroupId, reloadSymbolGroup, getInitPageCodeList, initPageByPageCode, updateDataToH5Index, updateDataToH5IndexView, initChannel, reloadCountry, reloadCatsTradeTypeAssets, reloadPaymentList } from '@index/Api/editor'
import { deepClone } from '@utils/deepClone'
import * as XLSX from 'xlsx'
import Vue from 'vue'
export default {
    name: 'Install',
    data () {
        return {
            type: 'uploadFile',
            reInput: null,
            infoList: []
        }
    },
    mounted () {
        this.startBgAni()
    },
    methods: {
        onChange (e) {
            const fileReader = new FileReader()
            fileReader.onload = event => {
                try {
                    const { result } = event.target
                    const workbook = XLSX.read(result, { type: 'binary' })
                    const fitstSheetName = workbook.SheetNames[0]
                    const settingSheet = workbook.Sheets[fitstSheetName]
                    const data = XLSX.utils.sheet_to_json(settingSheet, { defval: '' })[0]

                    this.install(data)
                } catch (e) {
                    this.$message({
                        type: 'success',
                        message: this.$t('install.label6')
                    })
                }
            }
            fileReader.readAsBinaryString(e.raw)
        },
        async install (data) {
            this.type = 'install'
            const copyData = deepClone(data)
            delete copyData.apiKey
            delete copyData.apiId
            delete copyData.apiUrl
            delete copyData.btKey
            delete copyData.btUrl
            delete copyData.h5Address
            delete copyData.h5PreviewAddress
            delete copyData.marginWarn
            delete copyData.marginLess
            delete copyData.isInitSymbol

            const formData = {
                page_code: 'SysSetting',
                title: this.$t('install.label41'),
                type: 'setup',
                other: JSON.stringify({ apiKey: data.apiKey, apiId: data.apiId, apiUrl: data.apiUrl, h5Address: data.h5Address, h5PreviewAddress: data.h5PreviewAddress, isInitSymbol: data.isInitSymbol + '', apiService: data.apiService, quoteService: data.quoteService, msgService: data.msgService, tradeService: data.tradeService, btKey: data.btKey, btUrl: data.btUrl, adminDomain: data.adminDomain, forwardDomain: data.forwardDomain }),
                content: JSON.stringify(Object.assign(copyData, { marginLevel: { marginLess: data.marginLess, marginWarn: data.marginWarn } }))
            }
            const _id = 1

            const initChannelState = await initChannel({
                skinId: '0001',
                webSite: data.h5Address,
                webViewSite: data.h5PreviewAddress
            })
            if (initChannelState.success) {
                this.setInfoList({ success: true, info: this.$t('install.label7') })
            } else {
                this.setInfoList({ success: true, info: this.$t('install.label8') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            const modifyPageData = await modifyPageConfig(formData)
            this.setInfoList({ loading: true, info: this.$t('install.label10') })
            if (modifyPageData.success) {
                this.setInfoList({ success: true, info: this.$t('install.label11') })
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label12') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }
            this.setInfoList({ loading: true, info: this.$t('install.label13') })
            const publishPage = await pushPage({ pageCode: 'SysSetting' })
            if (publishPage.success) {
                this.setInfoList({ success: true, info: this.$t('install.label14') })
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label15') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            this.setInfoList({ loading: true, info: this.$t('install.label16') })
            const checkData = await checkEnvironment()
            if (checkData.success) {
                checkData.data.forEach(item => {
                    this.setInfoList({ success: item.success, info: item.msg })
                    if (!item.success) {
                        this.setInfoList({ success: false, info: this.$t('install.label9') })
                    }
                })
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label17') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }
            this.setInfoList({ loading: true, info: this.$t('install.label18') })
            const reloadData = await reloadSymbol()
            if (reloadData.success) {
                const _reloadData = reloadData.data[0]
                this.setInfoList({ success: _reloadData.success, info: _reloadData.msg || _reloadData.errorMsg })
                if (!_reloadData.success) {
                    this.setInfoList({ success: false, info: '终止...' })
                    return
                }
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label19') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            this.setInfoList({ loading: true, info: this.$t('install.label20') })
            const accountGroupData = await reloadAccountGroup()
            if (accountGroupData.success) {
                const _data = accountGroupData.data[0]
                this.setInfoList({ success: _data.success, info: _data.msg })
                // for (let group of _data.data) {
                //     let productData = await reloadAccountGroupByGroupId({ accountGroupId: group.id });
                //     if (productData.success) {
                //         let _data = productData.data[0]
                //         this.setInfoList({ success: _data.success, info: `${group.name}${_data.msg || _data.errorMsg}` })

                //     } else {
                //         this.setInfoList({ success: false, info: '账户组信息初始化失败' })
                //         this.setInfoList({ success: false, info: '终止...' })
                //         return
                //     }
                // }

                const productData = await reloadSymbolGroup()
                if (productData.success) {
                    const _data = productData.data[0]
                    this.setInfoList({ success: _data.success, info: `${_data.msg || _data.errorMsg}` })
                } else {
                    this.setInfoList({ success: false, info: this.$t('install.label21') })
                    this.setInfoList({ success: false, info: this.$t('install.label9') })
                    return
                }
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label21') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            this.setInfoList({ loading: true, info: this.$t('install.label22') })
            const reloadCountryState = await reloadCountry()
            if (reloadCountryState.success) {
                this.setInfoList({ success: true, info: this.$t('install.label23') })
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label24') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            this.setInfoList({ loading: true, info: this.$t('install.label25') })
            const reloadAssetsState = await reloadCatsTradeTypeAssets()
            if (reloadAssetsState.success) {
                this.setInfoList({ success: true, info: this.$t('install.label26') })
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label27') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            this.setInfoList({ loading: true, info: this.$t('install.label28') })

            const reloadPaymentState = await reloadPaymentList()
            if (reloadPaymentState.success) {
                this.setInfoList({ success: true, info: this.$t('install.label29') })
            } else {
                this.setInfoList({ success: false, info: this.$t('install.label30') })
                this.setInfoList({ success: false, info: this.$t('install.label9') })
                return
            }

            this.setInfoList({ loading: true, info: this.$t('install.label31') })
            const pageCodeList = await getInitPageCodeList()
            console.log(pageCodeList)
            for (const page of pageCodeList.data) {
                const pageData = await initPageByPageCode({ page_code: page.pageCode })
                const pagePubData = await pushPage({ pageCode: page.pageCode })
                this.setInfoList({ success: pageData.success, info: `${page.title}${pageData.success ? this.$t('install.label32') : this.$t('install.label33')}` })
            }
            this.setInfoList({ success: true, info: this.$t('install.label34') })
            await updateDataToH5IndexView()
            await updateDataToH5Index()

            this.$alert(this.$t('install.label35'), this.$t('install.label36'), {
                confirmButtonText: this.$t('install.label37'),
                callback: action => {
                    this.$router.push({ name: 'Pages' })
                }

            })
        },
        setInfoList (data) {
            this.infoList.forEach(item => {
                if (item.loading) {
                    item.loading = false
                    item.success = true
                }
            })
            this.infoList.push(data)

            // 显示重试按钮
            if (data.success === false && !this.reInput) {
                this.reInput = this.$confirm(`${this.$t('install.label38')}(${data.info})!`, this.$t('install.label36'), {
                    confirmButtonText: this.$t('install.label39'),
                    cancelButtonText: this.$t('install.label40'),
                    type: 'warning',
                }).then(res => {
                    this.type = 'uploadFile'
                    this.infoList = []
                    this.reInput = null
                }).catch(error => {
                    this.$router.push({ name: 'Setting' })
                })
            }
            setTimeout(() => {
                this.$refs['scroll'].wrap.scrollTop = this.$refs['scroll'].wrap.scrollHeight + 50
            }, 500)
        },
        setSysData () {
            modifyPageConfig
        },
        startBgAni () {
            const pathEls = this.$refs.infoBg.querySelectorAll('path')
            for (let i = 0; i < pathEls.length; i++) {
                const pathEl = pathEls[i]
                const offset = anime.setDashoffset(pathEl)
                pathEl.setAttribute('stroke-dashoffset', offset)
                anime({
                    targets: pathEl,
                    strokeDashoffset: [offset, 0],
                    duration: anime.random(1000, 3000),
                    delay: anime.random(0, 2000),
                    loop: true,
                    direction: 'alternate',
                    easing: 'easeInOutSine',
                    autoplay: true
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.m-install {
    position: relative;
    width: 100vw;
    height: 100vh;
    text-align: center;
    .toSysSetting {
        padding: 60px;
        font-size: 18px;
        text-align: right;
        a {
            color: #409EFF;
        }
    }
    .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
.inputFile {
    display: inline-block;
    margin-top: 5vh;
    margin-left: -400px;
    .title {
        margin-bottom: 20px;
        color: #666;
        font-size: 28px;
    }
}
.showInfo {
    position: relative;
    display: inline-block;
    width: 600px;
    height: 500px;
    margin-left: -400px;
    padding-bottom: 20px;
    color: #666;
    font-size: 16px;
    text-align: left;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 12px 0;
    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        path {
            stroke-width: 2;
        }
    }
    .item {
        line-height: 30px;
        i {
            position: relative;
            top: 3px;
            margin-right: 10px;
            color: #999;
            font-size: 22px;
        }
        .el-icon-circle-close {
            color: #F56C6C;
        }
        .el-icon-loading {
            color: #409EFF;
        }
        .el-icon-success {
            color: #67C23A;
        }
    }
    .infoScroll {
        height: 100%;
        :deep(.el-scrollbar__wrap) {
            padding: 20px;
            overflow-x: hidden;
        }
    }
}
.progeress {
    margin-top: 4vh;
    padding: 0 20px;
    text-align: center;
}
</style>
