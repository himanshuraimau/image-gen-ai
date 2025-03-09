import express, { type Request, type Response } from 'express';
import { TrainModel, GenerateImage, GenerateImagesFromPack } from '@repo/common/types';
import { prismaClient } from 'db';

const app = express();
app.use(express.json());

const USER_ID = "1";

app.post("/ai/training", async (req: Request, res: Response): Promise<any> => {
    const parsedBody = TrainModel.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            error: "Invalid request body"
        });
    }

    const model = await prismaClient.model.create({
        data: {
            name: parsedBody.data.name,
            type: parsedBody.data.type,
            age: parsedBody.data.age,
            ethinicity: parsedBody.data.ethinicity,
            eyeColor: parsedBody.data.eyeColor,
            bald: parsedBody.data.bald,
            userId: USER_ID
        }
    });

    return res.json({
        modelId: model.id
    });
});


app.post("/ai/generate", async (req: Request, res: Response): Promise<any> => {
    const parsedBody = GenerateImage.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            error: "Invalid request body"
        });
    }

    const data = await prismaClient.outputImages.create({
        data: {
            prompt: parsedBody.data.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageUrl: ""

        }
    });

    res.json({
        imageId: data.id
    });
});


app.post("/pack/generate", async (req: Request, res: Response): Promise<any> => {
    const parsedBody = GenerateImagesFromPack.safeParse(req.body);

    if (!parsedBody.success) {
        return res.status(400).json({
            error: "Invalid request body"
        });
    }

    const prompts = await prismaClient.packPrompts.findMany({
        where: {
            packId: parsedBody.data.packId
        }
    });

    const images = await prismaClient.outputImages.createManyAndReturn({
        data: prompts.map(prompt => ({
            prompt: prompt.prompt,
            userId: USER_ID,
            modelId: parsedBody.data.modelId,
            imageUrl: ""
        }))
    });


    return res.json({
        imageIds: images.map(image => image.id)


    });
}
);


app.post("/pack/bulk", async (req: Request, res: Response): Promise<any> => {

    const packs = await prismaClient.packs.findMany({});

    return res.json({});

});


app.get("/image/bulk", async (req: Request, res: Response): Promise<any> => {
    const ids = req.query.images as string[];
    const limit = req.query.limit as string || "10";
    const offset = req.query.offset as string || "0";

    const imagesData = await prismaClient.outputImages.findMany({
        where: {
            id: { in: ids },
            userId: USER_ID
        },
        take: parseInt(limit),
        skip: parseInt(offset)
    })

    return res.json({
        images: imagesData
    })
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

