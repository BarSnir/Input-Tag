<template>
<div :id="'master-div-'+uniId" class="master-div" v-on:click="focusInput()">
      <div class="categories"
        v-for="(tag, index) in tags"
        v-bind:key="index">
      {{ tag }}
      </div>
      <div :id="'tag-container-'+uniId" class="tag">
        <input  
        :id ="'tag-input-'+uniId"
        class="tag-input"
        v-model="textInput"
        v-on:keyup.backspace="debounceAndProcess($event.target.value, 'remove')"
        v-on:keyup.comma="debounceAndProcess($event.target.value, 'add')" 
        v-on:keyup.left="moveLeftEl($event.target.value)"
        v-on:keyup.right="moveRightEl($event.target.value)" />
      </div>
</div>
</template>

<script>
import { StringUtil } from '../Utils/StringUtil';
import { LinkedList } from '../Services/LinkedListServices';
export default {
  name: 'HelloWorld',
  props:['uniId'],
  data() {
    return {
      timeOut:null,
      tags: ['ארון','ארונות','מגירות ארון'],
      textInput:"",
      cursorPointer:null,
      linkedList:null,
      stringUtils:null,
      elNamesObj:{
        master:"master-div-",
        parent:"tag-container-",
        input:"tag-input-"
      },
      lastAction:"add",
      removeItemTrigger:1
    }
  },
  beforeMount() {
    this.init();
  },
  updated() {
    this.updateInit();
  },
  methods:{
    init() {
      this.stringUtil = new StringUtil();
      this.linkedList = new LinkedList(this.tags[0]);
      for (let i = 1; i < this.tags.length; i++) {
        this.linkedList.append(this.tags[i]);
        this.cursorPointer = this.tags.length;
      }
      this.elNamesObj.master = this.elNamesObj.master+this.uniId;
      this.elNamesObj.parent = this.elNamesObj.parent+this.uniId;
      this.elNamesObj.input = this.elNamesObj.input+this.uniId;
    },
    updateInit() {
      this.$nextTick( () => {
        const actionHandler = {
            "add":{ handler:'', positionValue:1 },
            "remove":{ handler:'', positionValue:0 }
        };
        const action = actionHandler[this.lastAction];
        const master = document.getElementById(this.elNamesObj.master);
        const parent = document.getElementById(this.elNamesObj.parent);
        master.insertBefore(
          parent,
          master.childNodes[this.cursorPointer+(action.positionValue)]
        );
        this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent);
        this.focusInput();
      });
    },
    debounceAndProcess(val, state) {
      if(this.preventAddProccess(state)){
        return;
      }
      const handlers = {
        "add":this.processAddItemRender,
        "remove":this.processRemoveItemRender
      };
      if (this.timeout) clearTimeout(this.timeout); 
        this.timeout = setTimeout(() => {
          handlers[state](val);
        }, 30);
    },
    preventAddProccess(state){
      return !this.textInput.includes(',') && state=="add";
    },
    processAddItemRender(value) {
      let updateValue = this.stringUtil.replaceComma(value);
      this.addItemToTags(updateValue);
      this.appendInputToMasterNode();
      this.textInput = "";
    },
    processRemoveItemRender(val) {
      this.isItemReadyToRemove(val) &&
      this.removeItemFromTags(val);
    },
    appendInputToMasterNode() {
      document.getElementById(this.elNamesObj.master)
      .append(document.getElementById(this.elNamesObj.parent));
    },
    addItemToTags(val) {
      this.removeItemTrigger = 1;
      if( this.cursorPointer === 0 ){
        this.linkedList.prepend(val);
        this.updateItemRender();
        return;
      }
      this.linkedList.insert(this.cursorPointer, val);
      this.updateItemRender();
    },
    updateItemRender() {
      this.$nextTick(() => {
        this.tags = this.linkedList.printList();
        this.lastAction = 'add';
      });
    },
    removeItemFromTags() {
      this.removeItemTrigger = 0;
      if(!(this.cursorPointer-1)){
        this.linkedList.removeFirst();
        this.removeItemRender();
        return;
      }
      this.linkedList.remove(this.cursorPointer-1);
      this.removeItemRender();
    },
    removeItemRender() {
      this.$nextTick(() => {
        let temp = this.tags[this.cursorPointer-1];
        this.cursorPointer--;
        this.tags = this.linkedList.printList();
        this.textInput = temp;
        this.lastAction = 'remove';
      });
    },
    isItemReadyToRemove(val) {
      if (val.length !== 0) {
        this.removeItemTrigger = 0;
        return false;
      }
      this.removeItemTrigger++;
      return this.removeItemTrigger === 2;
    },
    moveRightEl(val) {
      let master = document.getElementById(this.elNamesObj.master);
      let parent = document.getElementById(this.elNamesObj.parent);
      let cousin = parent.previousSibling; 
      if (this.isElReadyToMove(cousin, val)) {
        this.focusInput();
        return;
      }
      master.insertBefore(parent, cousin);
      this.focusInput();
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent);
    },
    moveLeftEl(val) {
      let master = document.getElementById(this.elNamesObj.master);
      let parent = document.getElementById(this.elNamesObj.parent);
      let cousin = parent.nextSibling;
      if (this.isElReadyToMove(cousin, val)) {
        this.focusInput();
        return;
      }
      master.insertBefore(cousin,parent);
      this.focusInput();
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent) ;
    },
    isElReadyToMove(node, val) { 
      return (node === null) || (val.length !== 0);
    },
    focusInput() {
      document.getElementById(this.elNamesObj.input).focus();
    }
  }
}
</script>
<style scoped>
.master-div{
  display:block;
  width:500px;
  height:30px;
  border: 1px solid black;
  padding:12px 0 12px 15px;
  overflow:scroll; 
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y:unset;
  margin:0 auto;
  direction: rtl;
  border-radius:2px;
  margin-bottom:2px;
}
.tag{
  display:block;
  float: right;
}
.tag-input{
  display:block;
  border:0;
  min-width:5px;
  max-width:60px; 
  margin-right:10px;
}
.categories{
  display:block;
  margin-right:15px;
  border:1px solid black;
  border-radius:3px;
  padding:5px;
  float:right;
}
.tag-input:focus {
  outline: none;
}
</style>