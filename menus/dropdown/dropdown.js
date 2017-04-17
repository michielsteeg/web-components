Vue.component("n-menu-dropdown", {
	props: {
		actions: {
			types: Array,
			required: true
		}
	},
	template: "#n-menu-dropdown",
	data: function() {
		return {
			showing: []
		}
	},
	methods: {
		handle: function(action) {
			if (action.handler) {
				action.handler();
			}
		},
		hide: function(action) {
			var index = this.showing.indexOf(action);
			if (index >= 0) {
				this.showing.splice(index, 1);
			}
		},
		show: function(action) {
			if (this.showing.indexOf(action) < 0) {
				this.showing.push(action);
			}
		}
	}
});