class AdminUtil {
    /**
         * Thiết lập chức năng dựa trên đường dẫn của get/post
         * Đường dẫn cuối sẽ là duy nhất của từng chức năng
         * ví dụ: /db/edit-customer thì edit-customer là chức năng
         */
    setFunctionFromPath(req, res, next) {
        //gán đường dẫn phía sau cùng để gán chức năng cho nó
        req.functionCode = req.pathName ? req.pathName.substring(req.pathName.lastIndexOf("/") + 1) : undefined;
        next();
    }

    /**
     * req.functionCode = "active" //chuc nang toi thieu la active 
     * req.functionCode = "edit-customer" //yeu cau kiem tra quyen
     * //neu khong co functionCode thi xem nhu khong can kiem tra quyen
     */
    checkFunctionRole99(req, res, next) {
        if (req.functionCode
            && req.user 
            && 
            ((req.user.data && req.user.data.role === 99)
            || req.user.username === '903500888'
            || req.user.username === 'cuong.dq'
            )) {
            //can kiem tra quyen cua user co khong
            next() //quyen root
        } else {
            res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(
                {
                    message: 'Bạn không có quyền thực hiện chức năng này'
                    , user: req.user
                }
                , null, 2));
        }
    }

}

module.exports = new AdminUtil()