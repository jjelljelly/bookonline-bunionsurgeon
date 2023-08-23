import $ from 'jquery'

export const methods = {
    post: (url: string, data: {}, callback: (result: any) => void) => {
        $.post(url,
            data,
            async (res) => {
                let result = await JSON.parse(res);
                callback(result)
            })
    },
    readDate: (d: Date) => {
        return d.getDate() + ' ' + d.toDateString().split(' ')[1] + ' ' + d.getFullYear()
    }
}