/**
 *Copyright: Copyright (c) 2020
 *Author:JakHuang
 *Version 1.0 
 *Title: form-generator/Element UI表单设计及代码生成器 
 *GitHub: https://github.com/JakHuang/form-generator
 */

import { makeMap } from '../utils'

// 参考https://github.com/vuejs/vue/blob/v2.6.10/src/platforms/web/server/util.js
const isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,'
  + 'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,'
  + 'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,'
  + 'name,contenteditable,contextmenu,controls,coords,data,datetime,default,'
  + 'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,'
  + 'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,'
  + 'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,'
  + 'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,'
  + 'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,'
  + 'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,'
  + 'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,'
  + 'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,'
  + 'target,title,type,usemap,value,width,wrap'
)

function vModel ( self, dataObject, defaultValue ) {
  dataObject.props.value = defaultValue
  dataObject.on.input = val => {
    self.$emit( 'input', val )
  }
}

const componentChild = {
  'el-input': {
    prepend ( h, conf, key ) {
      return <template slot="prepend">{conf[key]}</template>
    },
    append ( h, conf, key ) {
      return <template slot="append">{conf[key]}</template>
    }
  },
  'el-select': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        list.push( <el-option label={item.label} value={item.value} disabled={item.disabled}></el-option> )
      } )
      return list
    }
  },
  'el-radio-group': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        if ( conf.optionType === 'button' ) list.push( <el-radio-button label={item.value}>{item.label}</el-radio-button> )
        else list.push( <el-radio label={item.value} border={conf.border}>{item.label}</el-radio> )
      } )
      return list
    }
  },
  'el-checkbox-group': {
    options ( h, conf, key ) {
      const list = []
      conf.options.forEach( item => {
        if ( conf.optionType === 'button' ) {
          list.push( <el-checkbox-button label={item.value}>{item.label}</el-checkbox-button> )
        } else {
          list.push( <el-checkbox label={item.value} border={conf.border}>{item.label}</el-checkbox> )
        }
      } )
      return list
    }
  },
  'el-upload': {
    'list-type': ( h, conf, key ) => {
      const list = []
      if ( conf['list-type'] === 'picture-card' ) {
        list.push( <i class="el-icon-plus"></i> )
      } else {
        list.push( <el-button size="small" type="primary" icon="el-icon-upload">{conf.buttonText}</el-button> )
      }
      if ( conf.showTip ) {
        list.push( <div slot="tip" class="el-upload__tip">只能上传不超过 {conf.fileSize}{conf.sizeUnit} 的{conf.accept}文件</div> )
      }
      return list
    }
  }
}

export default {
  render ( h ) {
    const dataObject = {
      attrs: {},
      props: {},
      on: {},
      style: {}
    }
    // 组件配置
    const confClone = JSON.parse( JSON.stringify( this.conf ) )
    // 渲染的node
    const children = []
    const childObjs = componentChild[confClone.tag] // el-input
    
    // console.log( Object.keys( childObjs )) //['prepend', 'append']
    if ( childObjs ) {
      Object.keys( childObjs ).forEach( key => {
        const childFunc = childObjs[key]
        // console.log("childFunc", confClone[key])
        // 判断传入的slot
        if ( confClone[key] ) {
          children.push( childFunc( h, confClone, key ) ) // 获取slot node
        }
      } )
    }
    // console.log("children====", children)   // [VNode]
    // console.log("confClone====", confClone) // 组件配置

    Object.keys( confClone ).forEach( key => {
      const val = confClone[key]
      if ( key === 'vModel' ) {
        // v-model 绑定
        vModel( this, dataObject, confClone.defaultValue )
      } else if ( dataObject[key] ) {
        // 判断 attr style on props
        dataObject[key] = val
      } else if ( !isAttr( key ) ) {
        // 判断是否为props
        dataObject.props[key] = val
      } else {
        // 作为属性传入
        dataObject.attrs[key] = val
      }
    } )
    console.log(this.conf.tag, dataObject, children)
    return h( this.conf.tag, dataObject, children ) // 类似 h('el-input',{style:{}}, [<template slot="prepend">111</template>])
  },
  props: ['conf']
}
