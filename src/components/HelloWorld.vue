<template>
<div id="master-div" v-on:click="focusInput()">
    <div class="categories"
      v-for="(tag, index) in tags"
      v-bind:key="index"
     >
    {{ tag }}
    </div>
    <div id="tag-container" class="tag">
         <input  
          id = "tag-input"
          class="tag-input"
          :value="textInput"
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
  data() {
    return {
      timeOut:null,
      tags: ['A','B','C'],
      textInput:null,
      cursorPointer:null,
      linkedList:null,
      stringUtils:null,
      elNamesObj:{
        master:"master-div",
        parent:"tag-container",
        input:"tag-input"
      },
      lastAction:null,
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
        const input = document.getElementById(this.elNamesObj.input);
        master.insertBefore(
          parent,
          master.childNodes[this.cursorPointer+(action.positionValue)]
        );
        this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent);
        input.focus();
      });
    },
    debounceAndProcess(val, state) {
      const handlers = {
        "add":this.processAddItemRender,
        "remove":this.processRemoveItemRender
      };
      if (this.timeout) clearTimeout(this.timeout); 
       this.timeout = setTimeout(() => {
          handlers[state](val);
       }, 30);
    },
    processAddItemRender(value) {
      let updateValue = this.stringUtil.replaceComma(value);
      this.addItemToTags(updateValue);
      this.appendInputToMasterNode();
      this.textInput = null;
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
<<<<<<< Updated upstream
    removeItemFromTags(val) {
      this.removeItemTrigger = 0;
      if(!(this.cursorPointer-1)){
        this.linkedList.removeFirst();
        this.removeItemRender();
        return;
=======
    removeItemFromTags(val){
      if(this.isRemoveTrigger(val)){
        this.removeItemTrigger = 0;
        if(this.cursorPointer-1===0 && this.tags.length > 2){
            this.linkedList.remove(0);
        }
        if (val.length === 0 || !this.tags[this.cursorPointer-1]) {
            this.linkedList.remove(this.cursorPointer-1);
        }
        this.$nextTick(() => {
          let tempText = this.tags[this.cursorPointer-1];
          this.cursorPointer--;
          this.tags = this.linkedList.printList();
          this.textInput = tempText;
        });
>>>>>>> Stashed changes
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
    moveLeftEl(val) {
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
    moveRightEl(val) {
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
#master-div{
  display:block;
  width:500px;
  height:30px;
  border: 1px solid black;
  padding:12px 0 12px 15px;
  overflow:scroll; 
  white-space: nowrap;
  overflow: auto;
  overflow-y: hidden;
  margin:0 auto;
}
.tag{
  display:inline-block;
}
.tag-input{
  border:0;
  min-width:5px;
  max-width:50px;
}
.categories{
  display:inline-block;
  margin-right:15px;
  border:1px solid black;
  border-radius:px;
  padding:5px;
  max-width:50px;
}
.tag-input:focus {
  outline: none;
}
</style>