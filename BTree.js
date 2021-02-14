class BTreeNode {
  constructor(isLeaf) {
    /**
     * @type {number[]} list of values in the node
    */
    this.values = [];
    /**
     * @type {boolean} is a leaf
    */
    this.leaf = isLeaf;
    /**
     * @type {BTreeNode[]}
    */
    this.children = [];
    /**
     * Reference to the tree its belong.
     * @type {BTree}
     */
    this.tree = null;
    /**
     * @type {BTreeNode}
    */
    this.parent = null;
  }

  /**
   * Number of values
   * @returns {number}
   */
  get n() {
    return this.values.length;
  }

  /**
   * Add value
   * @param {number} value 
   * @param {number} pos 
   */
  addValue(value) {
    if (!value) {
      return;
    }
    let pos = 0;
    while (pos < this.n && this.values[pos] < value) {
      pos++;
    }
    this.values.splice(pos, 0, value);
  }

  /**
   * Delete value and return it
   * @param {number} pos position
   * @return {number}
   */
  removeValue(pos) {
    if (pos >= this.n) {
      return null;
    }
    return this.values.splice(pos, 1)[0];
  }

  /**
   * Add child node at position pos
   * @param {BTreeNode} node 
   * @param {number} pos 
   */
  addChild(node, pos) {
    this.children.splice(pos, 0, node);
    node.parent = this;
  }
  /**
   * Delete node from position and return it
   * @param {number} pos 
   * @return {BTreeNode}
   */
  deleteChild(pos) {
    return this.children.splice(pos, 1)[0];
  }
}

/**
 * btree namespace.
 * @type {BTree}
*/
class BTree {
  constructor(order) {
    /** @type {number} */
    this.order = order;
    /** 
     * Root node of the tree.
     * @type {BTreeNode} 
    */
    this.root = new BTreeNode(true);
  }

  /**
   * Insert a new value in the tree O(log N)
   * @param {number} value
   */
  insert(value) {
    const actual = this.root;
    if (actual.n === 2 * this.order - 1) {
      // Create a new node to become the root
      // Append the old root to the new one
      const temp = new BTreeNode(false);
      temp.tree = this;
      this.root = temp;
      temp.addChild(actual, 0);
      this.__split(actual, temp, 1);
      this.__insertNonFull(temp, parseInt(value, 10));
    } else {
      this.__insertNonFull(actual, parseInt(value, 10));
    }
  };

  search(value) {
    for (let i = 0; i < this.root.values.length; i++) {
      if (value < this.root.values[i]) {
        return this.__searchValue(this.root.children[i], value);
      }
    }
  }

  /**
   * Deletes the value from the Tree. O(log N)
   * @param {number} value 
   */
  delete(value) {
    if (this.root.n === 1 && !this.root.leaf &&
      this.root.children[0].n === this.order - 1 && this.root.children[1].n === this.order - 1) {
      // Check if the root can shrink the tree into its childs
      this.__mergeNodes(this.root.children[1], this.root.children[0]);
      this.root = this.root.children[0];
    }
    // Start looking for the value to delete
    this.__deleteFromNode(this.root, parseInt(value, 10));
  }

  /**
  * Search a value in the Tree and return the node. O(log N)
  * @param {number} value
  * @param {BTreeNode} node
  * @returns {BTreeNode}
  */
  __searchValue(node, value) {
    if (node.values.includes(value)) {
      return node;
    }
    if (node.leaf) {
      // Value was not found
      return null;
    }
    let child = 0;
    while (child <= node.n && node.values[child] < parseInt(value, 10)) {
      child++;
    }
    return this.__searchValue(node.children[child], value);
  }

  /**
   * Delete a value from a node. O(log N)
   * @param {BTreeNode} node 
   * @param {number} value 
   */
  __deleteFromNode(node, value) {
    // Check if value is in the actual node 
    const index = node.values.indexOf(value);
    if (index >= 0) {
      // Value present in the node
      if (node.leaf && node.n > this.order - 1) {
        // If the node is a leaf and has more than order-1 values, just delete it
        node.removeValue(node.values.indexOf(value));
        return true;
      }
      // Check if one children has enough values to transfer
      if (node.children[index].n > this.order - 1 ||
        node.children[index + 1].n > this.order - 1) {
        // One of the immediate children has enough values to transfer
        if (node.children[index].n > this.order - 1) {
          // Replace the target value for the higher of left node.
          // Then delete that value from the child
          const predecessor = this.__getMinMaxFromSubTree(node.children[index], 1);
          node.values[index] = predecessor;
          return this.__deleteFromNode(node.children[index], predecessor);
        }
        const successor = this.__getMinMaxFromSubTree(node.children[index + 1], 0);
        node.values[index] = successor;
        return this.__deleteFromNode(node.children[index + 1], successor);
      }
      // Children has not enough values to transfer. Do a merge
      this.__mergeNodes(node.children[index + 1], node.children[index]);
      return this.__deleteFromNode(node.children[index], value);
    }
    // Value is not present in the node
    if (node.leaf) {
      // Value is not in the tree
      return false;
    }
    // Value is not present in the node, search in the children
    let nextNode = 0;
    while (nextNode < node.n && node.values[nextNode] < value) {
      nextNode++;
    }
    if (node.children[nextNode].n > this.order - 1) {
      // Child node has enough values to continue
      return this.__deleteFromNode(node.children[nextNode], value);
    }
    // Child node has not enough values to continue
    // Before visiting next node transfer a value or merge it with a brother
    if ((nextNode > 0 && node.children[nextNode - 1].n > this.order - 1) ||
      (nextNode < node.n && node.children[nextNode + 1].n > this.order - 1)) {
      // One of the immediate children has enough values to transfer
      if (nextNode > 0 && node.children[nextNode - 1].n > this.order - 1) {
        this.__transferValue(node.children[nextNode - 1], node.children[nextNode]);
      } else {
        this.__transferValue(node.children[nextNode + 1], node.children[nextNode]);
      }
      return this.__deleteFromNode(node.children[nextNode], value);
    }
    // No immediate brother with enough values.
    // Merge node with immediate one brother
    this.__mergeNodes(
      nextNode > 0 ? node.children[nextNode - 1] : node.children[nextNode + 1],
      node.children[nextNode]);
    return this.__deleteFromNode(node.children[nextNode], value);
  }

  /**
   * Transfer one value from the origin to the target. O(1)
   * @param {BTreeNode} origin 
   * @param {BTreeNode} target 
  */
  __transferValue(origin, target) {
    const indexo = origin.parent.children.indexOf(origin);
    const indext = origin.parent.children.indexOf(target);
    if (indexo < indext) {
      target.addValue(target.parent.removeValue(indexo));
      origin.parent.addValue(origin.removeValue(origin.n - 1));
      if (!origin.leaf) {
        target.addChild(origin.deleteChild(origin.children.length - 1), 0);
      }
    } else {
      target.addValue(target.parent.removeValue(indext));
      origin.parent.addValue(origin.removeValue(0));
      if (!origin.leaf) {
        target.addChild(origin.deleteChild(0), target.children.length);
      }
    }
  }

  /**
   * Merge 2 nodes into one with the parent median value. O(1)
   * @param {BTreeNode} origin 
   * @param {BTreeNode} target 
  */
  __mergeNodes(origin, target) {
    const indexo = origin.parent.children.indexOf(origin);
    const indext = target.parent.children.indexOf(target);
    target.addValue(target.parent.removeValue(Math.min(indexo, indext)));
    for (let i = origin.n - 1; i >= 0; i--) {
      target.addValue(origin.removeValue(i));
    }
    // Remove reference to origin node
    target.parent.deleteChild(indexo);
    // Transfer all the children from origin node to target
    if (!origin.leaf) {
      while (origin.children.length) {
        if (indexo > indext) {
          target.addChild(origin.deleteChild(0), target.children.length);
        } else {
          target.addChild(origin.deleteChild(origin.children.length - 1), 0);
        }
      }
    }
  }

  /**
   * Get the lower or higher value in a sub-tree. O(log N)
   * @param {BTreeNode} node 
   * @param { 0 | 1 } max 1 for find max, 0 for min
   * @returns {number}
   */
  __getMinMaxFromSubTree(node, max) {
    while (!node.leaf) {
      node = node.children[max ? node.n : 0];
    }
    return node.values[max ? node.n - 1 : 0];
  }

  /**
   * Divide child node from parent into parent.values[pos-1] and parent.values[pos]. O(1)
   * @param {BTreeNode} child 
   * @param {BTreeNode} parent 
   * @param {number} pos 
   */
  __split(child, parent, pos) {
    const newChild = new BTreeNode(child.leaf);
    newChild.tree = this.root.tree;
    // Create a new child
    // Pass values from the old child to the new
    for (let k = 1; k < this.order; k++) {
      newChild.addValue(child.removeValue(this.order));
    }
    // Trasspass child nodes from the old child to the new
    if (!child.leaf) {
      for (let k = 1; k <= this.order; k++) {
        newChild.addChild(child.deleteChild(this.order), k - 1);
      }
    }
    // Add new child to the parent
    parent.addChild(newChild, pos);
    // Pass value to parent
    parent.addValue(child.removeValue(this.order - 1));
    parent.leaf = false;
  }

  /**
   * Insert a value in a not-full node. O(1)
   * @param {BTreeNode} node 
   * @param {number} value
   */
  __insertNonFull(node, value) {
    // console.log({ node });
    if (node.leaf) {
      node.addValue(value);
      return;
    }
    let temp = node.n;
    while (temp >= 1 && value < node.values[temp - 1]) {
      temp = temp - 1;
    }
    if (node.children[temp].n === 2 * this.order - 1) {
      this.__split(node.children[temp], node, temp + 1);
      if (value > node.values[temp]) {
        temp = temp + 1;
      }
    }
    this.__insertNonFull(node.children[temp], value);
  }
}

module.exports = {
  BTreeNode,
  BTree,
}