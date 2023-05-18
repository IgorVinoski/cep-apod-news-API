import axios from 'axios';
import { Request, Response } from 'express';
import knex from '../../database/db';


export async function consultaApod(req: Request, res: Response) {
    try{
        if(!req.query.apikey){
            return res.status(404).json({
                message: "error not found apikey"
            })
        }else{
            
            const date = new Date();
            const dia = date.toLocaleDateString('en-GB'); // "dd/mm/yyyy"
            const select:any = await knex('apod').select('data_post',).where('data_post', `${dia}`)
            if(!select[0]){
                let url = `https://api.nasa.gov/planetary/apod?api_key=${req.query.apikey}`;
                const response = await axios.get(`${url}`)
                
                await knex('apod').insert({
                    copyright: response.data.copyright, 
                    data_post: response.data.date, 
                    explanation: response.data.explanation, 
                    hdurl: response.data.hdurl, 
                    media_type: response.data.media_type, 
                    service_version: response.data.service_version, 
                    title: response.data.title, 
                    url: response.data.url
                }).then(() => {
                    console.log('Inserindo o dia ', dia, ' na tabela')
                }).catch((e) => {
                    console.log('ERROR => ')
                    console.log(e)
                })
                return res.status(200).json(response.data)

            }else{
                console.log("TESTE")
                // const result:any = knex.raw(
                //     `select copyright, 
                //     to_char(data_post, 'dd/mm/yyyy') as date,  
                //     explanation, 
                //     hdurl, 
                //     media_type, 
                //     service_version, 
                //     title, 
                //     url 
                //     from apod`
                // )
                const subcolum = knex.raw(
                    `select to_char(data_post, 'dd/mm/yyyy') as date`
                )
                return res.status(200).send(await knex('apod').select("copyright", knex.raw(`to_char(data_post, 'dd/mm/yyyy') as date`), 'explanation', 'hdurl', 'media_type', 'service_version', 'title', 'url')
                )
            }
              

            
        }


    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
}
