import { PrismaClient } from '@prisma/client'
// import { add } from 'date-fns'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
    // const kwabena = await prisma.student.create({
    //     data:{
    //         email: "kdobengyeboah@st.knust.edu.gh",
    //         password: "Agent99.99",
    //         firstName: "Kwabena",
    //         middleName: "Darkwa",
    //         lastName: "Obeng-Yeboah",
    //         referenceNumber: "20675730",
    //         indexNumber: 8262719,
    //         studyProgram: "Computer Engineering",
    //         doubtPoints: 0.0,
    //         attendance: {

    //         },



    //     }})
    const akowuah = await prisma.lecturer.create({
        data: {
            email: "darkwak@live.com",
            firstName: "Kwabena",
            lastName: "Darkwa",
            password: "Agent99.99",
            title: "Mr",
            staffID: "STF/0001",
            course_has_lecturer:{
                create:{
                    course:{
                        connect:{
                            idcourse:1
                        }
                    }

                }
            
            }
            }
    

})


}

main()
    .catch((e: Error) => {
    console.error(e)
    process.exit(1)
    })
    .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect()
    })



