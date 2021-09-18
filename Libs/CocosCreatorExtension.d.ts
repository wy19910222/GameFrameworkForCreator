declare namespace cc {
	class Component {
		/**
		 !#en
		 When attaching to a node. onAwake is called before onLoad functions, this allows you to order initialization of scripts.<br/>
		 This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
		 !#zh
		 当附加到一个节点上时调用。onAwake 会在 onLoad 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
		 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
		 */
		protected onAwake(): void;
	}
}