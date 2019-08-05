<template>
<div id="master-div">
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
          v-on:keyup.backspace="removeItemFromTags($event.target.value)"
          v-on:keyup.comma="debounceInput($event.target.value)" 
          v-on:keyup.left="moveLeftEl()"
          v-on:keyup.right="moveRightEl()" />
    </div>
</div>
</template>

<script>
import { LinkedList } from '../services/LinkedListServices';
export default {
  name: 'HelloWorld',
  data(){
    return{
        timeOut:null,
        tags: ['A','B','C'],
        textInput:null,
        cursorPointer:null,
        linkedList:null,
        elNamesObj:{
          master:"master-div",
          parent:"tag-container",
          input:"tag-input"
        },
        removeItemTrigger:0
    }
  },
  beforeMount(){
    this.init();
  },
  updated(){
    this.updateInit();
  },
  methods:{
    init(){
      this.linkedList = new LinkedList(this.tags[0]);
      for (let i = 1; i < this.tags.length; i++) {
        this.linkedList.append(this.tags[i]);
        this.cursorPointer = this.tags.length;
      }
    },
    updateInit(){
      let parent = document.getElementById("tag-container");
      let master = document.getElementById("master-div");
      let input = document.getElementById("tag-input");
      master.insertBefore(
        parent,
        master.childNodes[this.cursorPointer] 
      );
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent);
      input.focus();
    },
    debounceInput(val){
      if (this.timeout) clearTimeout(this.timeout); 
       this.timeout = setTimeout(() => {
          this.processRender(val);
       }, 10);
    },
    processRender(value){
      let updateValue = this.replaceComma(value);
      this.appendInputToMasterNode();
      this.addItemToTags(updateValue);
      this.textInput = null;
    },
    replaceComma(expression){
      var find = ',';
      var re = new RegExp(find, 'g');
      return expression.replace(re,''); 
    },
    appendInputToMasterNode(){
      document.getElementById(this.elNamesObj.master)
      .append(document.getElementById(this.elNamesObj.parent));
    },
    addItemToTags(val){
      if( this.cursorPointer === 0 ){
        this.linkedList.prepend(val);
        this.updateTagRender()
        return;
      }
      this.linkedList.insert(this.cursorPointer, val);
      this.updateTagRender();
    },
    updateTagRender(){
      this.$nextTick(() => {
        this.tags = this.linkedList.printList();
      });
    },
    removeItemFromTags(val){
      let input = document.getElementById(this.elNamesObj.input);
      if(val.length!==0){
        return;
      }else{
        this.removeItemTrigger++
      }
      
      if(this.removeItemTrigger === 2){
        if(this.cursorPointer-1===0 && this.tags.length > 2){
          this.$nextTick(() => {
            let temp = this.tags[this.cursorPointer-1];
            this.linkedList.remove(0);
            this.cursorPointer--;
            this.tags = this.linkedList.printList();
            this.textInput = temp;
          });
        }
        if (input.nodeValue === null || !this.tags[this.cursorPointer-1]) {
          this.$nextTick(() => {
            let temp = this.tags[this.cursorPointer-1];
            this.linkedList.remove(this.cursorPointer-1);
            this.cursorPointer--;
            this.tags = this.linkedList.printList();
            this.textInput = temp;
          });
        }
        this.removeItemTrigger = 0;
      }

    },
    moveLeftEl(){
      let parent = document.getElementById("tag-container");
      let cousin = parent.previousSibling;
      let master = document.getElementById("master-div");
      let input = document.getElementById("tag-input");
      if (cousin === null) {
        input.focus();
        return;
      }
      master.insertBefore(parent, cousin);
      input.focus();
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent);
    },
    moveRightEl(){
      let parent = document.getElementById("tag-container");
      let cousin = parent.nextSibling;
      let master = document.getElementById("master-div");
      let input = document.getElementById("tag-input");
      if (cousin === null) {
        input.focus();
        return;
      }
      master.insertBefore(cousin,parent);
      input.focus();
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent) ;
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
