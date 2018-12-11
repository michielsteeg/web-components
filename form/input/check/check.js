Vue.component("n-form-checkbox", {
	props: {
		value: {
			required: true
		},
		item: {
			required: false
		},
		label: {
			type: String,
			required: false
		},
		// whether or not you are in edit mode
		edit: {
			type: Boolean,
			required: false,
			default: true
		},
		required: {
			type: Boolean,
			required: false,
			// explicitly set default value to null, otherwise vue will make it false which we can't distinguish from "not set"
			default: null
		},
		name: {
			type: String,
			required: false
		},
		// a json schema component stating the definition
		schema: {
			type: Object,
			required: false
		},
		hide: {
			type: Boolean,
			required: false,
			default: null
		},
		disabled: {
			type: Boolean,
			required: false
		},
		invert: {
			type: Boolean,
			required: false,
			default: false
		},
		validator: {
			type: Function,
			required: false
		},
		mustCheck: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: "#n-form-checkbox",
	data: function() {
		return {
			messages: [],
			valid: null,
			calculatedValue: false
		};
	},
	created: function() {
		if (this.value === "false") {
			this.calculatedValue = false;
		}
		else {
			this.calculatedValue = this.invertIfNecessary(this.value instanceof Array ? this.value.indexOf(this.item) >= 0 : this.value);
		}
	},
	computed: {
		definition: function() {
			return nabu.utils.vue.form.definition(this);
		},
		mandatory: function() {
			return nabu.utils.vue.form.mandatory(this);
		}
	},
	methods: {
		invertIfNecessary: function(value) {
			return this.invert ? !value : value;
		},
		validate: function() {
			// if the checkbox is set to mustCheck but the calculated value is null, false or undefined or anything but true, we imitate a null value to trigger the mandatory validation
			var messages = nabu.utils.schema.json.validate(this.definition, this.mustCheck && !this.calculatedValue ? null : (this.calculatedValue == null ? false : this.calculatedValue), this.mandatory || this.mustCheck);
			for (var i = 0; i < messages.length; i++) {
				messages[i].component = this;
			}
			if (this.validator) {
				var additional = this.validator(this.value);
				if (additional && additional.length) {
					for (var i = 0; i < additional.length; i++) {
						additional[i].component = this;
						if (typeof(additional[i].context) == "undefined") {
							additional[i].context = [];
						}
						messages.push(additional[i]);
					}
				}
			}
			this.valid = messages.length == 0;
			return messages;
		}, 
		toggleValue: function() {
			if (!this.disabled && this.edit) {
				if (this.value instanceof Array) {
					var index = this.value.indexOf(this.item);
					if (index >= 0) {
						this.value.splice(index, 1);
						this.$emit("remove", this.item);
					}
					else {
						this.value.push(this.item);
						this.$emit("add", this.item);
					}
				}
				else {
					this.$emit("input", this.invertIfNecessary(!this.calculatedValue));
				}
			}
		},
		updateChecked: function(value) {
			if (this.$refs && this.$refs.input) {
				if (value) {
					this.$refs.input.setAttribute("checked", "true");
				}
				else {
					this.$refs.input.removeAttribute("checked");
				}
			}
		}
	},
	watch: {
		value: function(newValue) {
			this.calculatedValue = this.invertIfNecessary(newValue instanceof Array ? newValue.indexOf(this.item) >= 0 : newValue);
			this.updateChecked(this.calculatedValue);
		}
	}
});

Vue.directive("checked", function(element, binding) {
	if ((binding.value instanceof Array && binding.length) || (!(binding.value instanceof Array) && binding.value)) {
		element.setAttribute("checked", "true");
	}
	else {
		element.removeAttribute("checked");
	}
});
