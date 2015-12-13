
function process(conf){
	
	
	
	const [req, reducers, actions, binders] = [conf, {}, {}, {}];
	
	console.log(req.keys());
	
	req.keys().forEach(function(name){
		
		let key=name.replace(/.*?\/([a-zA-Z0-9_\$]+?)\.js/,function(item,$1){
			return $1;
		});
		
		let obj=req(name);
		//初始化默认值
		if(typeof obj==='undefined') throw 'the action should had a default value';
		if(obj==null) obj={default:null};
		else if( obj.constructor!==Object) obj={default:obj};
		
		//console.log('初始值',obj);
		
		reducers[key]= (function(name,key,obj){return function reducer(state,action) {
			
			//初始化
			if(typeof state==='undefined'){
				if(obj['default'].constructor===Object){
					return Object.assign({},obj['default']);
				}else{
					return obj['default']||null;
				}
			}else{
				//没更新
				if(typeof action[key]==='undefined') {
					return state;
				}else{
					if(obj['default'].constructor!=Object) return action[key];
					else return Object.assign({}, state, action[key]);
				}
			}
			//有更新的情况
			//console.log(name,obj['default'],Object.assign({},state,action[key]||obj['default'],{meta:action.meta}));
			
			
		}})(name,key,obj);
		
		obj={...obj};
		delete obj.default;
		Object.keys(obj).forEach((item)=>{
			binders[item]=key;
		});
		Object.assign(actions,obj);
	});
	
	
	
	
	return {
		actions:actions,
		reducers:reducers,
		binders:binders
	}
	
}



exports['process']=process;





