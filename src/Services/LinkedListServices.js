export class LinkedList {
    constructor(value) {
        this.head = {
            value: value,
            next:null
        }
        this.tail = this.head;
        this.length = 1;
    }
    append(value) {
        let newNode = new Node(value);
        this.tail.next = newNode;   
        this.tail = newNode;
        this.length++;
        return this;
    }
    prepend(value) {
        let newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this;
    }
    printList() {
       const array = [];
       let currentNode = this.head;
       while (currentNode !== null) {
        array.push(currentNode.value);
        currentNode = currentNode.next;
       }
       return array;
    }
    insert(index, value) {
        if(index >= this.length){
            return this.append(value);
        }
        const newNode = new Node(value);
        const leader = this.traverseToIndex(index-1);
        const holdingPointer = leader.next;
        leader.next = newNode;
        newNode.next = holdingPointer;
        this.length++;
        return this.printList();
    }
    remove(index) {
        if(index >= this.length){
            this.tail.next = null;
        }
        const leader = this.traverseToIndex(index-1);
        const unwantedNode = leader.next;
        leader.next = unwantedNode.next;
        this.tail = this._updateTail();
        this.length--;
        return this.printList();
    }
    removeFirst(){
        this.head = this.traverseToIndex(1);
        return this.printList();  
    }
    traverseToIndex(index){
        let counter = 0;
        let currentNode = this.head;
        while (counter !== index) {
            currentNode = currentNode.next;
            counter++;
        }
        return currentNode;
    }
    _updateTail(){
        let currentNode = this.head;
        while (currentNode.next) {
            currentNode = currentNode.next;
        }
        return currentNode;
    }
}

export class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
