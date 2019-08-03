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
          v-on:keyup.comma="debounceInput($event.target.value)" 
          v-on:keyup.left="moveLeftEl()"
          v-on:keyup.right="moveRightEl()"
       />
    </div>
</div>
</template>

<script>
import { LinkedList, Node } from '../services/LinkedListServices';
export default {
  name: 'HelloWorld',
  data(){
    return{
        timeOut:null,
        tags: ['pen','pilot','stablo'],
        textInput:null,
        cursorPointer:null,
        linkedList:null
    }
  },
  beforeMount(){
    this.init();
  },
  updated(){
    let input = document.getElementById("tag-input");
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
      this.editItem(newView)
      this.textInput = null;
    },
    editItem(val){
      let parent = document.getElementById("tag-container");
      let master = document.getElementById("master-div");
      master.append(parent);
      if( this.cursorPointer === 0 ){
        this.linkedList.prepend(val);
      }else if(this.cursorPointer === this.tags.length ){
        this.linkedList.append(val);
      }else {
        this.linkedList.insert(this.cursorPointer, val);
      }
      this.$nextTick(() => {
        this.tags  = this.linkedList.printList();
        this.cursorPointer = this.tags.length;
      });
      
    },
    update(){
      this.tags = this.linkedList.printList();
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
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent) - 1 ;
      console.log(this.cursorPointer);
      master.insertBefore(parent, cousin);
      input.focus();
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
      this.cursorPointer = Array.prototype.indexOf.call(master.childNodes, parent) + 1 ;
      console.log(this.cursorPointer);
      master.insertBefore(cousin,parent);
      input.focus();
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
