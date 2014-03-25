function Obj(arg)
{
   this.arg = arg;
}

Obj.prototype.printArg = function()
{
   console.log(this.arg);
};


function Factory(bindto)
{
   this.objConstructor = function()
   {
      Obj.apply(this, arguments);
   };

   this.objConstructor.prototype = Object.create(Obj.prototype);

   this.objConstructor.prototype.bindto = bindto;
}

Factory.prototype.newInstance = function(arg)
{
   return new this.objConstructor(arg);
}

var bind = {bind: 1};

var factory = new Factory(bind);

var obj = factory.newInstance(2);

obj.printArg();

console.log(obj.bindto);
