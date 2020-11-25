import * as THREE from "three";

export function rotateUsingMatrix(a:number, b:number, g:number, obj:THREE.Object3D|THREE.Mesh|THREE.AxesHelper){ // rotation along z, y and x respectively, all at once.
    console.log("rotating object now");
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(Math.cos(a) * Math.cos(b), (Math.cos(a) * Math.sin(b) * Math.sin(g)) - (Math.sin(a) * Math.cos(g)), (Math.cos(a) * Math.sin(b) * Math.cos(g))- (Math.sin(a) * Math.sin(g)), 0,
        Math.sin(a) * Math.cos(b), (Math.sin(a) * Math.sin(b) * Math.sin(g))+(Math.cos(a) * Math.cos(g)), (Math.sin(a) * Math.sin(b) * Math.cos(g))-(Math.cos(a) * Math.sin(g)), 0,
        (-1) * Math.sin(b) , (Math.cos(b) * Math.sin(g)), Math.cos(b) * Math.cos(g), 0,
        0, 0, 0, 1);

    obj.matrix.multiply(trMatrix); // multiply the transformation matrix of the object with the matrix we got from parameter.
    return obj;
}

export function moveObject(x:number ,y:number,z:number, obj){ // move an object3d, mesh or a group by matrix multiplication
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(1,0,0,x,
        0,1,0,y,
        0, 0, 1, z,
        0,0,0,1);
    obj.matrix.multiply(trMatrix); // post multiplies objMatrix by trmatrix i.e. trMatrix x obj.matrix
    return obj;
}

export function highlightGroup(grp , color:string){ // recursively highlight all elements inside a group.
    grp.traverse(elem => elem.material?.color.set(color));
    return grp;
}

export function highlightChild(curr:THREE.Group){ // highlight child of currently highlighted object (group).
    for(var i=0; i<curr.children.length; i++) {
        if(curr.children[i] instanceof  THREE.Group){
            highlightGroup(curr, 'red'); // remove highlight on current object
            highlightGroup(curr.children[i], "blue"); // highlight child and its children.
            return curr.children[i]; // highlighted child is now current object
        }

    }
    return curr; // if this returns there was no instance of group in the array, stay where you are.


}

export function selectNextSibling(curr: any){ // find next sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    var i = siblings?.indexOf(curr);
    if(siblings.length <= 1 ){
        highlightGroup(curr, "blue");
        return curr;
    }else {
        for (var j = i; j < siblings.length; j++) {
            if (siblings[(j + 1)%siblings.length] instanceof THREE.Group) { // cycle through
                highlightGroup(siblings[(j+1)%siblings.length], "blue");
                highlightGroup(curr, "red");
                return siblings[(j + 1)%siblings.length];
            }
        }
        return curr;
    }
}


export function selectPrevSibling(curr){//find previous sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    const bislings = siblings;
    var i = bislings.indexOf(curr);
    if(bislings.length <= 1){ // if only current element is in the array or array is empty do nothing
        return curr;
    }else {
        for (var j = i; j >-1; j--) {
            j = j==0?siblings.length:j; // if j=0 set it to sib.length, else let it be.
            if (bislings[(j -1)] instanceof THREE.Group) {
                highlightGroup(bislings[(j-1)], "blue");
                highlightGroup(curr, "red");
                return bislings[(j-1)];
            }
        }
        return curr;
    }

}

export function highlightParent(curr:THREE.Group){ // go to parent, highlight if of type mesh (nested mesh geometry)
    if(curr.parent instanceof THREE.Group){
        highlightGroup(curr.parent, "blue"); // go to parent and highlight it.
        return curr.parent;
    }else{
        highlightGroup(curr, "blue");
        return curr;
    }
}


export function distFromCentre(grp: THREE.Group | THREE.Object3D){ // calculate distance from the centre
    // by calculating distance from its parent
    var curr = grp;
    var x=0, y=0, z=0;

    while(curr.parent){
        x+= curr.matrix.toArray()[12];
        y+= curr.matrix.toArray()[13];
        z += curr.matrix.toArray()[14];
        curr = curr.parent;
    }

    return [x,y,z];
}


export function resetAl(obj: THREE.Object3D| THREE.AxesHelper){ // resets all rotational componets of the matrix of an object.
    // save position components of the matrix
    var x = obj.matrix.toArray()[12];
    var y = obj.matrix.toArray()[13];
    var z = obj.matrix.toArray()[14];
    obj.matrix.identity(); // make the matrix identity
    moveObject(x,y,z,obj); // move the owbject to where it was reset rotation.
    if(obj instanceof THREE.AxesHelper){
        obj.visible = false;
    }
    return obj;
}