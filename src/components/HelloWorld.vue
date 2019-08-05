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
          v-on:keyup.backspace="removeItem()"
          v-on:keyup.comma="debounceInput($event.target.value)" 
          v-on:keyup.left="moveLeftEl()"
          v-on:keyup.right="moveRightEl()"
       />
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
        temp:null
    }
  },
  beforeMount(){
    this.init();
  },
  updated(){
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
  methods:{
    init(){
      this.linkedList = new LinkedList(this.tags[0]);
      for (let i = 1; i < this.tags.length; i++) {
        this.linkedList.append(this.tags[i]);
        this.cursorPointer = this.tags.length;
      }
    },
    replaceComma(expression){
      var find = ',';
      var re = new RegExp(find, 'g');
      return expression.replace(re,''); 
    },
    updateView(value){
      let newView = value;
      newView = this.replaceComma(newView);
      this.addItem(newView)
      this.textInput = null;
    },
    addItem(val){
      this.temp = val;
      let parent = document.getElementById("tag-container");
      let master = document.getElementById("master-div");
      master.append(parent);
      if( this.cursorPointer === 0 ){
        this.linkedList.prepend(val);
      }else {
        this.linkedList.insert(this.cursorPointer, val);
      }
      this.$nextTick(() => {
        this.tags = this.linkedList.printList();
      });
    },
    removeItem(){
      let input = document.getElementById("tag-input");
      if(this.textInput !== null && this.textInput !==""){
        return;
      }
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
    },
    debounceInput(val){
      if (this.timeout) clearTimeout(this.timeout); 
       this.timeout = setTimeout(() => {
          this.updateView(val);
       }, 10);
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
