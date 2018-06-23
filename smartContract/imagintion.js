"use strict";

var ImageItem = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.keywords = obj.keywords;
        this.authorTime = obj.authorTime;
        this.content = obj.content;
    } else {
        this.keywords = '';
        this.authorTime = '';
        this.content = '';
    }
};

ImageItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};


var Imagintion = function () {
    LocalContractStorage.defineProperty(this, "size");
    LocalContractStorage.defineMapProperty(this, "indexAuthor");
    LocalContractStorage.defineMapProperty(this, "imagination", {
        parse: function (text) {
            return new ImageItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Imagintion.prototype = {
    init: function () {
        this.size = 0;
    },
    get:function(title){
        return this.imagination.get(title);
    },
    save: function (now,keywords,content) {
        var author = Blockchain.transaction.from;
        var authorTime = author+'_'+now;
        var imageItem = new ImageItem();
        imageItem.authorTime = authorTime;
        imageItem.content = content;
        imageItem.keywords = keywords;
        this.imagination.put(authorTime,imageItem);
        this.indexAuthor.put(this.size,authorTime);
        this.size++;
    },
    len:function(){
        return this.size;
    },
    getSome: function(number){
        number = parseInt(number);
        var result  = [];
        var tempArr = [];
        if(number > this.size){
            number = this.size;
        }
        for(var j=0;j<number;j++){
            var temp = Math.random()*(this.size) >> 0;
            if(tempArr.indexOf(temp)==-1){
                tempArr.push(temp);
            }else{
                j = j-1;
            }
        }

        for(var i=0;i<tempArr.length;i++){
            var key = this.indexAuthor.get(tempArr[i]);
            var object = this.imagination.get(key);
            result.push(object);
        }

        return JSON.stringify(result);
    }
};
module.exports = Imagintion;