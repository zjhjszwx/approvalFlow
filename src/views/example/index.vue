
<script>
const layout = {
    fn(h, a) { 
        console.log(this) //一些重要的属性 $listeners $slots $attr
        return <h1>{a}</h1> 
    },
};

export default {
    render(h) {
        // return layout.fn.call(this, h, '222')
        return h('el-input',{}, [<template slot="prepend">111</template>])
    },
};
</script>
<style lang="">
</style>