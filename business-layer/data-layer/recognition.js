import { Recognition, Member } from "../db";

/**
 * Create a recognition record
 * @param {number} memberId - The ID of the member
 * @param {number} recognitionYear - The year the recognition was received
 * @param {number} recognitionType - The type of recognition
 */
async function createRecognition(memberId, recognitionYear, recognitionType) {
  try {
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error("Member not found");
    }

    const recognition = await Recognition.create({
      member_id: memberId,
      recognition_year: recognitionYear,
      recognition_type: recognitionType,
    });

    return recognition;
  } catch (error) {
    console.error("Error creating recognition:", error.message);
    throw error;
  }
}

/**
 * 
 * @param {number} memberId - The ID of the member
 * @returns {Promise<Array>} List of recognition records
 */
async function getRecognitions(memberId) {
  try {
    const member = await Member.findByPk(memberId, {
      include: [
        {
          model: Recognition,
          as: "recognitions",
        },
      ],
    });

    if (!member) {
      throw new Error("Member not found");
    }

    return member.recognitions;
  } catch (error) {
    console.error("Error fetching recognitions:", error.message);
    throw error;
  }
}

export {
  createRecognition,
  getRecognitions,
};
