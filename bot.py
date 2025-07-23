import discord
from discord.ext import commands
from datetime import datetime
import asyncio

# Bot configuration
INTENTS = discord.Intents.default()
INTENTS.voice_states = True
INTENTS.guilds = True
INTENTS.members = True

# Channel ID where logs will be sent
LOG_CHANNEL_ID = 1344479547168391255

class VCLoggerBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix='!', intents=INTENTS)
        
    async def on_ready(self):
        print(f'{self.user} has connected to Discord!')
        print(f'Bot is in {len(self.guilds)} guilds')
        
        # Check if the log channel exists
        log_channel = self.get_channel(LOG_CHANNEL_ID)
        if log_channel:
            print(f'Log channel found: #{log_channel.name} in {log_channel.guild.name}')
        else:
            print(f'Warning: Could not find channel with ID {LOG_CHANNEL_ID}')
    
    async def on_voice_state_update(self, member, before, after):
        """Handle voice channel join/leave events"""
        log_channel = self.get_channel(LOG_CHANNEL_ID)
        if not log_channel:
            return
        
        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Create embed for the log message
        embed = discord.Embed(color=0x2F3136)
        embed.set_author(name=member.display_name, icon_url=member.display_avatar.url)
        embed.timestamp = datetime.now()
        
        # User joined a voice channel
        if before.channel is None and after.channel is not None:
            embed.title = "🟢 Joined Voice Channel"
            embed.description = f"**Channel:** {after.channel.name}"
            embed.color = 0x57F287  # Green
            
        # User left a voice channel
        elif before.channel is not None and after.channel is None:
            embed.title = "🔴 Left Voice Channel"
            embed.description = f"**Channel:** {before.channel.name}"
            embed.color = 0xED4245  # Red
            
        # User moved between voice channels
        elif before.channel != after.channel and before.channel is not None and after.channel is not None:
            embed.title = "🔄 Moved Voice Channels"
            embed.description = f"**From:** {before.channel.name}\n**To:** {after.channel.name}"
            embed.color = 0xFEE75C  # Yellow
            
        else:
            # Other voice state changes (mute/unmute, deafen/undeafen, etc.)
            return
        
        # Add footer with server name
        embed.set_footer(text=f"Server: {member.guild.name}")
        
        try:
            await log_channel.send(embed=embed)
        except discord.Forbidden:
            print(f"Missing permissions to send messages in {log_channel.name}")
        except Exception as e:
            print(f"Error sending log message: {e}")

# Create bot instance
bot = VCLoggerBot()

# Optional: Add a command to test if the bot is working
@bot.command(name='vctest')
async def test_command(ctx):
    """Test command to verify bot is working"""
    if ctx.author.guild_permissions.administrator:
        await ctx.send("✅ VC Logger bot is working! Voice channel events will be logged.")
    else:
        await ctx.send("❌ You need administrator permissions to use this command.")

# Run the bot
if __name__ == "__main__":
    # Replace with your actual bot token from Discord Developer Portal
    TOKEN = 'MTM2NjI3MjczOTU2ODI1NTAxNg.GP8Ksz.QJ9lJ7wBH8nhL05fLs6HSB7iSJhrV77yFD8vlw'
    bot.run(TOKEN)
