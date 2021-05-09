//验证规则
//自定义校验规则
var checkEmail = (rule, value, cb) => {
  const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if (regEmail.test(value)) {
    //合法邮箱
    return cb();
  }
  cb(new Error("请输入合法邮箱"));
};

//验证手机号的正则表达式
var checkMobil = (rule, value, cb) => {
  const regMobil = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (regMobil.test(value)) {
    //合法邮箱
    return cb();
  }
  cb(new Error("请输入合法手机号"));
}


export const email = [{ required: true, message: "请输入邮箱", trigger: "blur" },
  { validator: checkEmail, trigger: "blur" }
]

export const mobile = [{ required: true, message: "请输入手机号码", trigger: "blur" },
  { validator: checkMobil, trigger: "blur" }
]

export const username = [
  { required: true, message: "请输入用户名", trigger: "blur" },
  {
    min: 3,
    max: 8,
    message: "长度在 3 到 8个字符",
    trigger: "blur",
  },
]
export const cat_name = [
  { required: true, message: "请输入分类名称", trigger: "blur" },

]
export const password = [
  { required: true, message: "请输入密码", trigger: "blur" },
  {
    min: 6,
    max: 12,
    message: "长度在 6 到 12 个字符",
    trigger: "blur",
  }
]