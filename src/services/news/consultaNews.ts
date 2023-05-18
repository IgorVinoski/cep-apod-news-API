import axios from 'axios';
import { Request, Response } from 'express';
import knex from '../../database/db';

export async function consultaNews(req: Request, res: Response) {
    try{
        if(!req.headers.apikey){
            return res.status(404).json({
                message: "error not found apikey"
            })}else{
                const palavra_chave = req.params.palavrachave;
                const url = 'https://newsapi.org/v2/top-headlines?' +
                `q=${palavra_chave}&` +
                `apiKey=${req.headers.apikey}`
                console.log(url)
                const date = new Date();
                const dia = date.toLocaleDateString('en-GB'); // "dd/mm/yyyy"
                const select:any = await knex('news').select('*').where('dia', `${dia}`)
                if(!select[0]){
                    console.log("testando")
                    const response = await axios.get(`${url}`)
                    for(let article of response.data.articles){
                        await knex('news').insert({
                            dia: dia,  
                            palavra_chave: palavra_chave,
                            id: article.source.id, 
                            name: article.source.name, 
                            author: article.author, 
                            title: article.title, 
                            description: article.description, 
                            url: article.url, 
                            urltoimage: article.urlToImage,
                            publishedat: article.publishedAt,
                            content: article.content,
                        }).then(() => {
                            console.log('Inserindo na tabela')
                        }).catch((e) => {
                            console.log('ERROR => ')
                            console.log(e)
                        })
                    }
                    return res.status(200).json(response.data)
                }else{
                    const articles = await knex('news').select('*',).where('dia', `${dia}`)
                    const newArticles: any[] = [];
                    for(let article of articles){
                        const newArticle = {
                            source: {
                                id: article.id, 
                                name: article.name
                            },
                            author: article.author,
                            title: article.title,
                            description: article.description,
                            url: article.url,
                            urlToImage: article.urltoimage,
                            publishedAt: article.publishedat,
                            content: article.content
                        }


                        newArticles.push(newArticle);
                    }
                    const response = {
                        status: "ok",
                        totalResults: articles.length,
                        articles: newArticles
                    }
                    return res.status(200).json(response)
                }
            }
    }catch(e){
        console.log(e)
        return res.status(400).send(e)
    }
}
