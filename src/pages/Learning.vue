<template>
    <div class="">
        <div class="q-gutter-md">
            <q-carousel
                v-model="slide"
                transition-prev="scale"
                transition-next="scale"
                swipeable
                animated
                control-color="primary"
                navigation
                padding
                arrows
            >
                <q-carousel-slide name="style" class="column no-wrap flex-center">
                    <q-icon name="style" size="56px" />
                    <div class="q-mt-md text-center">
                        {{ lorem }}
                    </div>
                </q-carousel-slide>
                <q-carousel-slide name="tv" class="column no-wrap flex-center">
                    <q-icon name="live_tv" size="56px" />
                    <div class="q-mt-md text-center">
                        {{ lorem }}
                    </div>
                </q-carousel-slide>
                <q-carousel-slide name="layers" class="column no-wrap flex-center">
                    <q-icon name="layers" size="56px" />
                    <div class="q-mt-md text-center">
                        {{ lorem }}
                    </div>
                </q-carousel-slide>
                <q-carousel-slide name="map" class="column no-wrap flex-center">
                    <q-icon name="terrain" size="56px" />
                    <div class="q-mt-md text-center">
                        {{ lorem }}
                    </div>
                </q-carousel-slide>
            </q-carousel>
            <div class="q-pa-md q-gutter-sm">
                <q-btn flat color="primary" label="Flat" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Learning",
        data () {
            return {
                navPos: 'top',
                slide: 'style',
                lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
            }
        }

    }
</script>

<style scoped>

</style>
