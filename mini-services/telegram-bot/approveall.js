// Approve all pending registrations
bot.onText(/\/approveall/, async (msg) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;
  
  if (!isAdmin(adminId)) {
    sendAdminErrorResponse(chatId, '🚫 Admin access required! You are not authorized to use this command.');
    return;
  }
  
  let approvedCount = 0;
  let notificationMessage = `📝 <b>BULK REGISTRATION APPROVALS</b> 📝\n\n✅ <b>All Pending Registrations Approved</b> ✅\n\n🎯 <b>Admin Action:</b> Bulk approval completed successfully!\n\n💰 <b>Credits Awarded:</b> 25 credits per approved user\n\n📊 <b>Users Approved:</b> `;
  
  // Approve all pending requests
  for (const [userId, request] of registrationRequests) {
    if (request.status === 'pending') {
      request.status = 'approved';
      request.approvedDate = new Date();
      request.approvedBy = adminId.toString();
      
      // Update user registration status and give credits
      const user = users.get(userId);
      if (user) {
        user.isRegistered = true;
        user.registrationDate = new Date();
        user.credits += 25; // Give 25 credits per approved user
        approvedCount++;
        
        // Notify user of approval
        try {
          await bot.sendMessage(request.chatId, `🎉 <b>REGISTRATION APPROVED</b> 🎉\n\n✨ <b>Congratulations! Your registration has been approved!</b> ✨\n\n💰 <b>Welcome Bonus:</b> 💎 <b>25 Free Credits</b> have been added to your account!\n🎯 <b>Total Balance:</b> ${user.credits} credits\n🔍 <b>Full Access Unlocked:</b>\n• All OSINT lookup tools available\n• Query history tracking\n• Premium upgrade options\n• Priority support access\n📊 <b>Registration Details:</b>\n🆔 Approved by: Premium Admin\n📅 <b>Approval Date: ${new Date().toLocaleString()}\n📋 </b>Status: Active Registered User\n💎 <b>Thank you for joining our OSINT community!</b>\n🚀 <b>Start exploring premium OSINT features now!</b>`);
        } catch (error) {
          console.log(`Could not notify user ${userId} about registration approval`);
        }
    }
  }
  }
  
  if (approvedCount === 0) {
    notificationMessage += 'No pending registrations found to approve.';
  } else {
    notificationMessage += `${approvedCount} users approved successfully!`;
  }
  
  notificationMessage += `\n\n💎 <b>Bulk Approval Summary:</b>\n📊\n• Total Approved: ${approvedCount}\n• Credits Distributed: ${approvedCount <b> 25}\n• Users Notified: All approved users received notifications\n💎 </b>System Status:* All pending requests processed`;
  }
  
  sendAdminSuccessResponse(chatId, notificationMessage);
});